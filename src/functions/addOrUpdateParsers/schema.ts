import { AddOrUpdateParsersInputType } from '@definitions/inputs/add-or-update-parsers.input';
import { JSONSchemaType } from 'ajv';

export const addOrUpdateParsersSchema: JSONSchemaType<AddOrUpdateParsersInputType> =
  {
    type: 'object',
    properties: {
      channelId: { type: 'number', example: 16 },
      type: { type: 'string', example: 'create' },
      currency: { type: 'string', example: 'KRW', nullable: true },
      mailParser: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            parseKey: { type: 'string' },
            parseRegex: { type: 'string' },
            format: { type: 'string', nullable: true },
            required: { type: 'boolean' },
          },
          required: ['parseKey', 'parseRegex'],
        },
        example: [
          {
            parseKey: 'propertyName',
            parseRegex: '/숙소명\\n(.*)/',
            required: true,
          },
          {
            parseKey: 'reservationId',
            parseRegex: '/숙소 예약번호\\n(\\d+)/',
            required: true,
          },
          {
            parseKey: 'roomType',
            parseRegex: '/객실정보\\n(.*)/',
            required: true,
          },
          {
            parseKey: 'guestName',
            parseRegex: '/예약자명\\n(.*)/',
            required: true,
          },
          {
            parseKey: 'guestPhone',
            parseRegex: '/연락처\\n(\\d+)/',
            required: true,
          },
          {
            parseKey: 'checkInDate',
            parseRegex: '/입실일시\\n(.*)/',
            required: true,
            foramt: 'date',
          },
          {
            parseKey: 'checkOutDate',
            parseRegex: '/퇴실일시\\n(.*)/',
            required: true,
            foramt: 'date',
          },
          {
            parseKey: 'salePrice',
            parseRegex: '/판매가\\n(.*)/',
            required: true,
            format: 'number',
          },
          {
            parseKey: 'netPrice',
            parseRegex: '/입금가\\n(.*)/',
            required: true,
            format: 'number',
          },
        ],
      },
    },
    required: ['channelId', 'type', 'mailParser'],
  };
