export interface GmailPushNotification {
  emailAddress: string;
  historyId: string;
}

export interface PubSubMessageRaw {
  message: {
    data: string;
    messageId: string;
    publishTime: string;
  };
  subscription: string;
}

export interface PubSubMessage {
  message: {
    data: GmailPushNotification;
    messageId: string;
    publishTime: string;
  };
  subscription: string;
  messageId?: string;
  isRetry?: boolean;
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  body: string;
  bodyText: string;
}

export enum MessageStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  RECEIVED = 'received',
  PARSED = 'parsed',
}
