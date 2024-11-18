import { addOrUpdateChannelAuthSchema } from '@functions/addOrUpdateChannelAuth/schema';
import { addOrUpdateParsersSchema } from '@functions/addOrUpdateParsers/schema';
import { addOrUpdatePropertyChannelMappingSchema } from '@functions/addOrUpdatePropertyChannelMapping/schema';
import { addOrUpdateRatePlanMappingSchema } from '@functions/addOrUpdateRatePlanMapping/schema';
import addMotherEmailGroupInputSchema from '@functions/addOrUpdateVendor/schema';
import { processEmailNotificationSchema } from '@functions/processEmailNotification/schema';
import { registerChannelEmailSchema } from '@functions/registerChannelEmail/schema';
import { registerPropertyEmailSchema } from '@functions/registerPropertyEmail/schema';
import { slackBlockActionPayloadSchema } from '@functions/slack/schema';

export const serverlessDocumentation = {
  version: '1',
  title: 'Email Voucher CMS',
  description: 'Email Voucher CMS System by ONDA',
  models: [
    {
      name: 'ErrorResponse',
      description: 'General Error Response',
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            description: 'HTTP status code',
            example: 400,
          },
          body: {
            type: 'string',
            description: 'Error message',
            example: '{"message": "error"}',
          },
        },
      },
    },
    {
      name: 'SuccessResponse',
      description: 'General Success Response',
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            description: 'HTTP status code',
            example: 200,
          },
          body: {
            type: 'string',
            description: 'Response body',
            example: '{"message": "success"}',
          },
        },
      },
    },
    {
      name: 'AddMotherEmailGroupRequestInput',
      description: 'Add mother email group request input model',
      contentType: 'application/json',
      schema: addMotherEmailGroupInputSchema,
    },
    {
      name: 'AddOrUpdateChannelAuthRequestInput',
      description: 'Add or update channel auth request input model',
      contentType: 'application/json',
      schema: addOrUpdateChannelAuthSchema,
    },
    {
      name: 'AddOrUpdateParsersRequestInput',
      description: 'Add or update parsers request input model',
      contentType: 'application/json',
      schema: addOrUpdateParsersSchema,
    },
    {
      name: 'AddOrUpdateRatePlanMappingRequestInput',
      description: 'Add or update rate plan mapping request input model',
      contentType: 'application/json',
      schema: addOrUpdateRatePlanMappingSchema,
    },
    {
      name: 'ProcessEmailNotificationRequestInput',
      description: 'GCP PubSub message payload',
      contentType: 'application/json',
      schema: processEmailNotificationSchema,
    },
    {
      name: 'RegisterChannelEmailRequestInput',
      description: 'Register channel email request input model',
      contentType: 'application/json',
      schema: registerChannelEmailSchema,
    },
    {
      name: 'RegisterPropertyEmailRequestInput',
      description: 'Register property email request input model',
      contentType: 'application/json',
      schema: registerPropertyEmailSchema,
    },
    {
      name: 'AddOrUpdatePropertyChannelMappingRequestInput',
      description: 'Add or update property channel mapping request input model',
      contentType: 'application/json',
      schema: addOrUpdatePropertyChannelMappingSchema,
    },
    {
      name: 'SlackBlockitActionPayload',
      description: 'Slack interactive message action payload',
      contentType: 'application/json',
      schema: slackBlockActionPayloadSchema,
    },
  ],
  servers: [
    {
      url: 'https://api.evcms.tport.dev',
      description: 'Development API endpoint',
    },
  ],
  tags: [],
};
