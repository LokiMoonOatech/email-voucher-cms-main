import { EVCMS_ERRORS } from '@definitions/types/errors.type';
import { processEmail } from '@libs/email/process';
import { middyfy } from '@libs/lambda';
import Logger from '@libs/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { parsePubSubMessage } from './utils';

const logger = new Logger('processEmailNotification', 'handler');

const processEmailNotificationHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  logger.log(event, event.body);
  if (!event.body) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        ...EVCMS_ERRORS.INVALID_EVENT_BODY,
      }),
    };
  }

  const pubSubMessage = parsePubSubMessage(event);

  if (!pubSubMessage) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        ...EVCMS_ERRORS.INVALID_PUBSUB_MESSAGE,
      }),
    };
  }

  logger.log(pubSubMessage);

  const {
    isRetry,
    messageId,
    message: {
      data: { historyId },
    },
  } = pubSubMessage;

  await processEmail({
    historyId,
    messageId,
    isRetry,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Email processed successfully',
    }),
  };
};

export const processEmailNotification = middyfy(
  processEmailNotificationHandler,
);
