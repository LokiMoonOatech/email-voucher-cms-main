import { ChannelType, MailTypeParserInterface } from 'src/database';

export interface RegisterChannelEmailInputType {
  registeredEmail: string;
  channelId: number;
  channelAlias: string;
  channelType?: ChannelType;
  mailTypeParser: MailTypeParserInterface[];
}
