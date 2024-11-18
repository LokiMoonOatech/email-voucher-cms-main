import { EvcmsError, EVCMS_ERRORS } from '@definitions/types/errors.type';
import axios from 'axios';
import { ChannelAuth, MailParserInterface } from 'src/database';

type RegexObject = Record<string, RegExp>;

export const isIgnorableError = (code: number) => code >= 40000 && code < 50000;

export function createMailParsers(
  regexObject: RegexObject,
): MailParserInterface[] {
  const mailParsers: MailParserInterface[] = [];

  for (const key in regexObject) {
    const mailParser = {
      parseKey: key,
      parseRegex: regexObject[key].toString(),
      required: true,
    };
    mailParsers.push(mailParser);
  }

  return mailParsers;
}

function escapeRegExp(string: string): string {
  return string.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&'); // $& means the whole matched string
}

export function refineRegExpString(
  regString: string,
  escape: boolean = false,
): string {
  let refinedString = regString;
  if (regString.startsWith('/')) {
    refinedString = regString.slice(1, -1);
  }

  if (escape) {
    refinedString = refinedString.replace(/\s/g, '');
    return escapeRegExp(refinedString);
  }
  return refinedString;
}

export async function getChannelAuthToken(channelId: number): Promise<string> {
  const foundChannelAuth = await ChannelAuth.findOne({
    channelId,
  });

  if (!foundChannelAuth) {
    throw new EvcmsError(
      EVCMS_ERRORS.CHANNEL_AUTHENTICATION_FAILED,
      channelId.toString(),
    );
  }

  return foundChannelAuth.channelGdsAccessToken;
}

interface SlackEmailData {
  emailMetaData?: {
    from: string;
    to: string;
    subject: string;
  };
  parsedData?: Record<string, unknown>;
  errorData?: Record<string, unknown>;
}

export function formatSlackEmailDataForSlack(
  slackEmailData: SlackEmailData,
): unknown[] {
  const blocks: unknown[] = [];
  // Add header block
  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: 'New Email Received',
    },
  });

  // Add email meta data block if emailMetaData is present
  if (slackEmailData.emailMetaData) {
    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*From:*\n${slackEmailData.emailMetaData.from}`,
        },
        {
          type: 'mrkdwn',
          text: `*To:*\n${slackEmailData.emailMetaData.to}`,
        },
        {
          type: 'mrkdwn',
          text: `*Subject:*\n${slackEmailData.emailMetaData.subject}`,
        },
      ],
    });
  }

  // Add data block if parsedData is present
  if (slackEmailData.parsedData) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Parsed Data:*\n${JSON.stringify(slackEmailData.parsedData)}`,
      },
    });
  }

  // Add error block if error is present
  if (slackEmailData.errorData) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Error:*\n${JSON.stringify(slackEmailData.errorData)}`,
      },
    });
  }

  return blocks;
}
