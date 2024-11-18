import { AddOrUpdateVendorInputType } from '@definitions/inputs/add-mother-email-group.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { createGmailClient } from '@libs/gmail-client';
import { middyfy } from '@libs/lambda';
import Logger from '@libs/logger';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { initializeMongoose, MotherEmailGroup } from 'src/database';

const logger = new Logger('AddOrUpdateVendor', 'handler');

const addOrUpdateVendorHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const gmail = await createGmailClient();

  const { labelName, vendorAlias, vendorId, groupEmail } = JSON.parse(
    event.body || '',
  ) as AddOrUpdateVendorInputType;

  logger.log('Api execution started');

  logger.log(event.body);

  const labels = await gmail.users.labels.list({
    userId: 'me',
  });

  logger.log(labels);

  const foundLabel = labels.data.labels?.find(
    (label) => label.name === labelName,
  );

  if (!foundLabel) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Label not found' }),
    };
  }

  await gmail.users.watch({
    userId: 'me',
    requestBody: {
      labelIds: [foundLabel.id as string],
      topicName: process.env.GCP_PUBSUB_TOPIC,
    },
  });

  const existingGroup = await MotherEmailGroup.findOne({
    labelId: foundLabel.id as string,
  });

  logger.log(existingGroup);

  if (existingGroup) {
    existingGroup.labelName = labelName;
    existingGroup.vendorAlias = vendorAlias;
    existingGroup.vendorId = vendorId;
    existingGroup.groupEmail = groupEmail;

    await existingGroup.save();
  } else {
    const createdGroup = new MotherEmailGroup({
      labelId: foundLabel.id as string,
      labelName,
      vendorAlias,
      vendorId,
      groupEmail,
    });

    await createdGroup.save();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Mother Email Group added successfully' }),
  };
};

export const addOrUpdateVendor = middyfy(addOrUpdateVendorHandler);
