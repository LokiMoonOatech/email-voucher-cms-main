import { AddOrUpdatePropertyChannelMappingInput } from '@definitions/inputs/add-or-update-property-channel-mapping.input';
import { JSONSchemaType } from 'ajv';

export const addOrUpdatePropertyChannelMappingSchema: JSONSchemaType<AddOrUpdatePropertyChannelMappingInput> =
  {
    type: 'object',
    properties: {
      propertyId: {
        type: 'number',
        example: 120135,
      },
      enabled: {
        type: 'boolean',
        example: true,
        nullable: true,
      },
      agreedToTerms: {
        type: 'boolean',
        example: true,
        nullable: true,
      },
      channelIds: {
        type: 'array',
        items: {
          type: 'number',
        },
        nullable: true,
        example: [164, 165, 166, 167, 168],
      },
    },
    required: ['propertyId'],
  };
