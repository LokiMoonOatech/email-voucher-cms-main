import { RegisterPropertyEmailInputType } from '@definitions/inputs/register-property-email.input';
import { JSONSchemaType } from 'ajv';

export const registerPropertyEmailSchema: JSONSchemaType<RegisterPropertyEmailInputType> =
  {
    type: 'object',
    properties: {
      registeredEmail: {
        type: 'string',
        format: 'email',
        example: 'yeongjongwesterngrace@onda.me',
      },
      registeredName: {
        type: 'string',
        example: '영종 웨스턴 그레이스 호텔',
      },
      channelId: {
        type: 'number',
        example: 16,
      },
      propertyId: {
        type: 'number',
        example: 120135,
      },
    },
    required: ['registeredEmail', 'propertyId'],
  };
