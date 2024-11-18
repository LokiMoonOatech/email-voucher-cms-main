import { AddOrUpdateChannelAuthInputType } from '@definitions/inputs/add-or-update-channel-auth.input';
import { JSONSchemaType } from 'ajv';

export const addOrUpdateChannelAuthSchema: JSONSchemaType<AddOrUpdateChannelAuthInputType> =
  {
    type: 'object',
    properties: {
      channelId: { type: 'number', example: 16 },
      channelGdsAccessToken: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfa2V5IjoiMzZiNDk4OTc0MzJmOWRhODFiZWUyMDJmNTk4NmYxMjRjZDg4ZDkwNjE3NGNkMDU1ZTAzNWI0ZTljYjk2MjkzYyIsInRpbWVzdGFtcCI6MTY1MDQzMzQ4NTE1Nywic2VydmljZV9pZCI6MSwidGFyZ2V0IjoiY2hhbm5lbCIsInRhcmdldF9pZCI6MSwiaWF0IjoxNjUwNDMzNDg1LCJleHAiOjE3MTM1MDU0ODV9.9u12nUDqnmELvB77XpTezHRgZ_XRgRN-S9DJNduRIoc',
      },
    },
    required: ['channelId', 'channelGdsAccessToken'],
  };
