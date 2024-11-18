import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';

import { getPropertyEvcmsEnableStatusesDocumentation } from './documentation';
import { getPropertyEvcmsEnableStatusesSchema } from './schema';

const getPropertyEvcmsEnableStatuses: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.getPropertyEnableStatuses`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getPropertyEvcmsEnableStatuses',
        cors: true,
        request: {
          parameters: {
            querystrings: getPropertyEvcmsEnableStatusesSchema,
          },
        },
        documentation: getPropertyEvcmsEnableStatusesDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default getPropertyEvcmsEnableStatuses;
