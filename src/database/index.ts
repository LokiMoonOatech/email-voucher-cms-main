import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import mongoose from 'mongoose';
import PassivePromise from 'passive-promise';

// initialize mongoose

const initializer = new PassivePromise(() => {});

export const initializeMongoose = async () => initializer;

const main = async () => {
  let MONGO_URL = '';
  const secretsManagerClient = new SecretsManagerClient({
    region: 'ap-northeast-2',
  });

  if (process.env.NODE_ENV === 'local') {
    MONGO_URL = process.env.MONGODB_CONNECTION_STRING || '';
  } else {
    const mongoConnectionStringResponse = await secretsManagerClient.send(
      new GetSecretValueCommand({
        SecretId: 'evcms/mongodb-connection-string',
      }),
    );

    MONGO_URL = mongoConnectionStringResponse.SecretString || '';
  }
  await mongoose.connect(MONGO_URL);
};

main()
  .then(initializer.resolve)
  .catch((error) => {
    console.log(error);
  });

export { default as GmailMetaData } from './models/gmail-metadata.model';
export { default as MotherEmailGroup } from './models/mother-email-group.model';
export { default as ProcessedMessage } from './models/processed-message.model';
export { default as ChannelAuth } from './models/channel-auth.model';
export { default as PropertyEmailRegistration } from './models/property-email-registration.model';
export * from './models/channel-mail-parser.model';
