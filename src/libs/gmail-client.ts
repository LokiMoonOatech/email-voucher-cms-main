import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const createGmailClient = async () => {
  const clientId = process.env.GMAIL_CLIENT_ID;
  let clientSecret: string | undefined;
  let refreshToken: string | undefined;

  if (process.env.NODE_ENV === 'local') {
    clientSecret = process.env.GMAIL_CLIENT_SECRET;
    refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  } else {
    const secretsManagerClient = new SecretsManagerClient({
      region: 'ap-northeast-2',
    });

    try {
      const clientSecretResponse = await secretsManagerClient.send(
        new GetSecretValueCommand({
          SecretId: 'evcms/gmail-client-secret',
        }),
      );
      const refreshTokenResponse = await secretsManagerClient.send(
        new GetSecretValueCommand({
          SecretId: 'evcms/gmail-refresh-token',
        }),
      );

      clientSecret = clientSecretResponse.SecretString;
      refreshToken = refreshTokenResponse.SecretString;
    } catch (error) {
      console.log(error);
    }
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret);

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};

export { createGmailClient };
