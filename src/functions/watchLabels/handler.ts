import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { createGmailClient } from '@libs/gmail-client';
import Logger from '@libs/logger';
import { Handler } from 'aws-lambda';
import { initializeMongoose, MotherEmailGroup } from 'src/database';

const logger = new Logger('watchLabels', 'handler');

export const watchLabels: Handler =
  async (): Promise<HttpFunctionReturnType> => {
    await initializeMongoose();
    const gmail = await createGmailClient();

    const motherEmailGroups = await MotherEmailGroup.find();

    logger.log(
      'motherEmailGroups::',
      motherEmailGroups.map((group) => group.toJSON()),
    );

    const labelIds = motherEmailGroups.map((group) => group.labelId);

    logger.log('Sending watch request for labelIds::', labelIds);

    const watchResponse = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        labelIds,
        topicName: process.env.GCP_PUBSUB_TOPIC,
      },
    });

    logger.log('watchResponse::', watchResponse.data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Watch request sent successfully',
        data: watchResponse.data,
      }),
    };
  };
