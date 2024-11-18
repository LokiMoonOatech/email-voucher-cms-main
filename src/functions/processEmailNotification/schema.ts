import { JSONSchemaType } from 'ajv';

export interface ProcessEmailNotificationEvent {
  subscription: string;
  message: {
    data: string;
    messageId: string;
  };
  messageType: string;
  messageId: string;
  isRetry: boolean;
}

export const processEmailNotificationSchema: JSONSchemaType<ProcessEmailNotificationEvent> =
  {
    type: 'object',
    properties: {
      subscription: {
        type: 'string',
        example:
          'projects/email-voucher-cms/subscriptions/voucher-email-push-notification-dev',
      },
      message: {
        type: 'object',
        properties: {
          data: { type: 'string' },
          messageId: { type: 'string' },
        },
        required: ['data', 'messageId'],
        example:
          '{"data":"eyJlbWFpbEFkZHJlc3MiOiJlbWFpbGNtc0BvbmRhLm1lIiwiaGlzdG9yeUlkIjoxMDkzMn0=","messageId":"7271015636951961","message_id":"7271015636951961","publishTime":"2023-03-28T06:00:48.122Z","publish_time":"2023-03-28T06:00:48.122Z"}',
      },
      messageType: { type: 'string' },
      messageId: { type: 'string' },
      isRetry: { type: 'boolean' },
    },
    required: ['subscription', 'message'],
  };
