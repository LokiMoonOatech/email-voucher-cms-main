import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';

import { getPropertyRateplanMappingsDocumentation } from './documentation';
import { getPropertyRatePlanMappingsSchema } from './schema';

const getPropertyRatePlanMappings: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.getPropertyRatePlanMappings`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getPropertyRatePlanMappings',
        cors: true,
        request: {
          parameters: {
            querystrings: getPropertyRatePlanMappingsSchema,
          },
        },
        documentation: getPropertyRateplanMappingsDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default getPropertyRatePlanMappings;
