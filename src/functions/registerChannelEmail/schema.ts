import { RegisterChannelEmailInputType } from '@definitions/inputs/register-channel-email.input';
import { JSONSchemaType } from 'ajv';

export const registerChannelEmailSchema: JSONSchemaType<RegisterChannelEmailInputType> =
  {
    type: 'object',
    properties: {
      channelId: { type: 'number', example: 16 },
      channelAlias: { type: 'string', example: 'yanolja' },
      channelType: { type: 'string', nullable: true },
      registeredEmail: { type: 'string', example: 'no_reply@yanolja.com' },
      mailTypeParser: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            testRegex: { type: 'string' },
          },
          required: ['type', 'testRegex'],
        },
        example: '[{"type":"create","testRegex":"/예약 정보 안내/"}]',
      },
    },
    required: ['channelId', 'registeredEmail', 'mailTypeParser'],
  };
