import { EvcmsError, EVCMS_ERRORS } from '@definitions/types/errors.type';
import { MessageStatus } from '@definitions/types/gmail.type';
import { ParsedStandardEmailBookingData } from '@definitions/types/parser.type';
import {
  getEmailDetails,
  refineEmailData,
} from '@functions/processEmailNotification/utils';
import { parseAndProcessEmail } from '@libs/email/parse';
import { isIgnorableError } from '@libs/helpers';
import Logger from '@libs/logger';
import { formatEmailError, postSlackMessage } from '@libs/slack';
import { Document, HydratedDocument, Types } from 'mongoose';
import { addPropertyBooking } from 'src/apis/gds/add-booking.api';
import { cancelPropertyBooking } from 'src/apis/gds/cancel-booking.api';
import {
  GmailMetaData,
  initializeMongoose,
  MessageType,
  ProcessedMessage,
} from 'src/database';
import { GmailMetaDataInterface } from 'src/database/models/gmail-metadata.model';
import { ProcessedMessageInterface } from 'src/database/models/processed-message.model';

import { calculateRefundAmount } from './util';

const logger = new Logger('email-process', 'libs');

export const processEmail = async ({
  historyId,
  messageId,
  isRetry,
}: {
  historyId: string;
  messageId?: string;
  isRetry?: boolean;
}) => {
  await initializeMongoose();
  let gmailMetaData:
    | (Document<unknown, {}, GmailMetaDataInterface> &
        Omit<
          GmailMetaDataInterface & {
            _id: Types.ObjectId;
          },
          never
        >)
    | null = null;

  if (!isRetry) {
    gmailMetaData = await GmailMetaData.findOneAndUpdate(
      {
        userId: 'me',
      },
      {
        $max: {
          latestHistoryId: Number.parseFloat(historyId),
        },
      },
    );
  }

  logger.log('Current metadata', gmailMetaData);
  logger.log('Current historyId', historyId);
  logger.log('Current messageId', messageId);

  if (!gmailMetaData && !messageId && !isRetry) {
    const initGmailMetadata = new GmailMetaData({
      userId: 'me',
      latestHistoryId: Number.parseFloat(historyId),
    });

    await initGmailMetadata.save();

    return true;
  }

  if (
    !isRetry &&
    gmailMetaData &&
    gmailMetaData.latestHistoryId >= Number.parseFloat(historyId)
  ) {
    return false;
  }

  // 2. Retrieve email details and process them
  const emailDatas = isRetry
    ? await getEmailDetails(historyId, historyId, {
        messageId,
      })
    : await getEmailDetails(
        gmailMetaData!.latestHistoryId.toString(),
        historyId,
      );

  if (emailDatas.length === 0) {
    return false;
  }

  logger.log('emailDatas', emailDatas);

  for (const emailData of emailDatas) {
    let processedMessage: Document<
      unknown,
      {},
      ProcessedMessageInterface
    > | null = null;

    try {
      const duplicatedMessage = await ProcessedMessage.findOne({
        id: emailData.id,
      });

      if (duplicatedMessage) {
        if (isRetry) {
          await duplicatedMessage.deleteOne();
        } else {
          return false;
        }
      }

      processedMessage = new ProcessedMessage({
        id: emailData.id,
        batchHistoryId: historyId,
        historyId: emailData.historyId,
        status: MessageStatus.RECEIVED,
      });

      const refinedData = refineEmailData(emailData);

      if (!refinedData) {
        throw new EvcmsError(EVCMS_ERRORS.INVALID_EMAIL_MESSAGE);
      }

      logger.log(refinedData);

      processedMessage.set('subject', refinedData.subject || '');

      const { parsedData, channelMailParser } = await parseAndProcessEmail(
        refinedData,
      );

      logger.log(parsedData);

      processedMessage.set('parsedData', {
        ...parsedData,
        guestName: '***',
        guestPhone: '***********',
      });
      processedMessage.set('status', MessageStatus.PARSED);

      if (!parsedData.propertyId || !parsedData.channelId) {
        throw new EvcmsError(EVCMS_ERRORS.FAILED_TO_PARSE_REQUIRED_FIELD);
      }

      switch (parsedData.messageType) {
        case MessageType.CREATE: {
          const bookingNumbers: string[] = [];

          if (parsedData.bookingCount > 1) {
            bookingNumbers.push(...parsedData.bookingNumber.split('\n'));
          } else {
            bookingNumbers.push(parsedData.bookingNumber);
          }

          await Promise.all(
            bookingNumbers.map(async (bookingNumber) => {
              const bookingResult = await addPropertyBooking({
                propertyId: parsedData.propertyId,
                channelId: parsedData.channelId,
                input: {
                  // format date to YYYY-MM-DD
                  currency: channelMailParser.currency || 'KRW',
                  checkin: parsedData.checkInDate.toISOString().split('T')[0],
                  checkout: parsedData.checkOutDate.toISOString().split('T')[0],
                  booker: {
                    name: parsedData.guestName,
                    phone: parsedData.guestPhone,
                    email: 'hello@onda.me',
                  },
                  channel_booking_number: bookingNumber,
                  rateplans: [
                    {
                      rateplan_id: parsedData.ratePlanId,
                      price: Math.round(
                        parsedData.salePrice / bookingNumbers.length,
                      ),
                      guest: {
                        name: parsedData.guestName,
                        phone: parsedData.guestPhone,
                        adult: 2,
                      },
                    },
                  ],
                },
              });

              processedMessage?.set(
                'gdsBookingNumber',
                bookingResult.booking_number,
              );
              processedMessage?.set(
                'bookingNumber',
                bookingResult.channel_booking_number,
              );
            }),
          );
          break;
        }

        case MessageType.CANCEL: {
          const { bookingNumber, propertyId, channelId } = parsedData;

          if (!bookingNumber) {
            throw new EvcmsError(EVCMS_ERRORS.FAILED_TO_PARSE_REQUIRED_FIELD, {
              bookingNumber,
              parsedData,
            });
          }

          const foundBookingHistory = await ProcessedMessage.findOne({
            bookingNumber,
          });

          if (!foundBookingHistory?.gdsBookingNumber) {
            throw new EvcmsError(EVCMS_ERRORS.CANCELLABLE_BOOKING_NOT_FOUND, {
              bookingNumber,
              parsedData,
            });
          }

          const { salePrice: originSalePrice } =
            foundBookingHistory.parsedData as ParsedStandardEmailBookingData;

          const calculatedRefundAmount = calculateRefundAmount(
            parsedData,
            foundBookingHistory.parsedData as ParsedStandardEmailBookingData,
          );

          const cancelResult = await cancelPropertyBooking({
            propertyId,
            channelId,
            gdsBookingNumber: foundBookingHistory.gdsBookingNumber,
            input: {
              canceled_by: 'user',
              currency: channelMailParser.currency || 'KRW',
              reason: 'voucher_canceled',
              refund_amount: calculatedRefundAmount,
              total_amount: originSalePrice,
            },
          });

          processedMessage.set('gdsBookingNumber', cancelResult.booking_number);
          processedMessage.set(
            'bookingNumber',
            cancelResult.channel_booking_number,
          );

          break;
        }

        default:
          throw new EvcmsError(
            EVCMS_ERRORS.INVALID_MESSAGE_TYPE,
            parsedData.messageType,
          );
      }

      processedMessage.set('status', MessageStatus.SUCCESS);
    } catch (error) {
      if (processedMessage) {
        processedMessage.set('status', MessageStatus.FAILED);
        processedMessage.set('errorData', {
          message: error.message,
          code: error.code,
          data: error.data,
        });
      }

      if (!isIgnorableError(Number(error.code))) {
        await postSlackMessage(
          formatEmailError(
            error,
            processedMessage as HydratedDocument<ProcessedMessageInterface>,
          ),
        );
      }
    } finally {
      if (processedMessage) {
        await processedMessage.save();
      }
    }
  }

  return true;
};
