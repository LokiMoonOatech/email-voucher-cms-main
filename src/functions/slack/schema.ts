import { SlackBlockActionPayloadInputType } from '@definitions/inputs/slack-block-action-payload.input';
import { JSONSchemaType } from 'ajv';

export const slackBlockActionPayloadSchema: JSONSchemaType<SlackBlockActionPayloadInputType> =
  {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['block_actions'] },
      team: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          domain: { type: 'string' },
        },
        required: [],
      },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          team_id: { type: 'string' },
        },
        required: [],
      },
      api_app_id: { type: 'string' },
      token: { type: 'string' },
      container: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          message_ts: { type: 'string' },
          attachment_id: { type: 'number' },
          channel_id: { type: 'string' },
          is_ephemeral: { type: 'boolean' },
          is_app_unfurl: { type: 'boolean' },
        },
        required: [],
      },
      trigger_id: { type: 'string' },
      channel: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
        required: [],
      },
      message: {
        type: 'object',
        properties: {
          bot_id: { type: 'string' },
          type: { type: 'string' },
          text: { type: 'string' },
        },
        required: [],
      },
      response_url: { type: 'string' },
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action_id: { type: 'string' },
            block_id: { type: 'string' },
            text: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                text: { type: 'string' },
                emoji: { type: 'boolean' },
              },
              required: [],
            },
            value: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string' },
            action_ts: { type: 'string' },
          },
          required: [],
        },
      },
    },
    required: [],
  };
