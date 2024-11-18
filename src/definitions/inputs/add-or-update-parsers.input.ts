import { MailParserInterface } from 'src/database';

export interface AddOrUpdateParsersInputType {
  channelId: number;
  type: string;
  currency?: string;
  mailParser: MailParserInterface[];
}
