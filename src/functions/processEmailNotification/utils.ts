import {
  EmailData,
  GmailPushNotification,
  PubSubMessage,
  PubSubMessageRaw,
} from '@definitions/types/gmail.type';
import { createGmailClient } from '@libs/gmail-client';
import Logger from '@libs/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ParsedMailbox, parseOneAddress } from 'email-addresses';
import { gmail_v1 } from 'googleapis';
import { convert as converHtml } from 'html-to-text';

const logger = new Logger('processEmailNotification', 'utils');

export const convertHtmlToString = (html: string) => {
  return converHtml(html, { wordwrap: null, preserveNewlines: true })
    .split(/\n|\r/g)
    .filter(Boolean)
    .join('\n');
};

function isPubSubMessageRaw(obj: any): obj is PubSubMessageRaw {
  return Boolean(
    obj &&
      typeof obj.subscription === 'string' &&
      obj.message &&
      typeof obj.message.data === 'string' &&
      typeof obj.message.messageId === 'string' &&
      typeof obj.message.publishTime === 'string',
  );
}

export const getEmailDetails = async (
  latestHistoryId: string,
  currentHistoryId: string,
  {
    messageId,
  }: {
    messageId?: string;
  } = {},
): Promise<gmail_v1.Schema$Message[]> => {
  const gmail = await createGmailClient();

  try {
    logger.log('fetching email details');

    if (messageId) {
      const fullMessage = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
      });

      return [fullMessage.data];
    }

    const response = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: latestHistoryId,
      maxResults:
        Number.parseFloat(currentHistoryId) -
        Number.parseFloat(latestHistoryId),
    });

    const histories =
      response.data.history?.filter(
        (history) =>
          history.id &&
          Number.parseFloat(history.id) < Number.parseFloat(currentHistoryId),
      ) || [];

    logger.log('histories', histories);

    const emailHistories = histories.filter(
      (history) => history.messagesAdded?.length,
    );

    logger.log('emailHistories', emailHistories);

    if (emailHistories.length === 0) return [];

    const messageSkeletons = emailHistories
      .flatMap((history) =>
        history.messagesAdded?.map((message) => message.message),
      )
      .filter(Boolean);

    if (messageSkeletons.length === 0) return [];

    const fullMessages = await Promise.all(
      messageSkeletons.map(async (messageSkeleton) =>
        gmail.users.messages.get({
          userId: 'me',
          id: messageSkeleton?.id as string,
        }),
      ),
    );

    return fullMessages.map((res) => res.data);
  } catch (error) {
    console.error(`Error fetching email details: ${error}`);
    throw error;
  }
};

export const refineEmailData = (
  emailData: gmail_v1.Schema$Message,
): EmailData | null => {
  if (!emailData.payload) return null;

  const emailParts = emailData.payload.parts;
  if (!emailParts) return null;

  emailParts.push(
    ...emailParts.reduce<gmail_v1.Schema$MessagePart[]>(
      (acc: gmail_v1.Schema$MessagePart[], part: gmail_v1.Schema$MessagePart) =>
        [...acc, ...(part.parts || [])] as gmail_v1.Schema$MessagePart[],
      [],
    ),
  );

  const htmlPart = emailParts.find(
    (part: any) => part.mimeType === 'text/html',
  );
  const body = htmlPart?.body
    ? Buffer.from(htmlPart.body.data as string, 'base64').toString()
    : '';
  const subject = emailData.payload.headers?.find(
    (header: any) => header.name === 'Subject',
  )?.value;

  const { headers } = emailData.payload;

  const originalFrom = (
    parseOneAddress(
      headers?.find((header) => header.name === 'X-Original-From')?.value || '',
    ) as ParsedMailbox | null
  )?.address;

  const from = (
    parseOneAddress(
      headers?.find((header) => header.name === 'From')?.value || '',
    ) as ParsedMailbox | null
  )?.address;

  const to = (
    parseOneAddress(
      headers?.find((header) => header.name === 'To')?.value || '',
    ) as ParsedMailbox | null
  )?.address;

  return {
    from: originalFrom || from || '',
    to: to || '',
    subject: subject || '',
    body,
    bodyText: (body && convertHtmlToString(body)) || '',
  };
};

export function parsePubSubMessage(
  event: APIGatewayProxyEvent,
): PubSubMessage | null {
  try {
    const messageData = JSON.parse(event.body || '');

    if (!isPubSubMessageRaw(messageData)) {
      return null;
    }

    const decodedData: GmailPushNotification = JSON.parse(
      Buffer.from(messageData.message.data, 'base64').toString(),
    ) as GmailPushNotification;

    return {
      ...messageData,
      message: {
        ...messageData.message,
        data: decodedData,
      },
    };
  } catch (error) {
    console.error('Failed to parse PubSubMessage:', error);
  }

  return null;
}
