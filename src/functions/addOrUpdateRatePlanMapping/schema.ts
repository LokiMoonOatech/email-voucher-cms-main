import { AddOrUpdateRatePlanMappingInputType } from '@definitions/inputs/add-or-update-rateplan-mapping.input';
import { JSONSchemaType } from 'ajv';

export const addOrUpdateRatePlanMappingSchema: JSONSchemaType<AddOrUpdateRatePlanMappingInputType> =
  {
    type: 'object',
    properties: {
      propertyId: {
        type: 'number',
        example: 120135,
      },
      channelId: {
        type: 'number',
        example: 16,
      },
      ratePlanMappings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            roomTypeId: {
              type: 'number',
            },
            ratePlanId: {
              type: 'number',
            },
            testRegex: {
              type: 'string',
            },
          },
          required: ['roomTypeId', 'ratePlanId', 'testRegex'],
        },
        nullable: true,
        example: [
          {
            roomTypeId: 1465268,
            ratePlanId: 1600012,
            testRegex: 'Test room',
          },
          { roomTypeId: 1465268, ratePlanId: 1600013, testRegex: '테스트' },
          {
            roomTypeId: 1459430,
            ratePlanId: 1592655,
            testRegex: 'Test room 2',
          },
          {
            roomTypeId: 1459430,
            ratePlanId: 1599822,
            testRegex: '카카오 전용 테스트',
          },
        ],
      },
    },
    required: ['propertyId', 'channelId'],
  };
