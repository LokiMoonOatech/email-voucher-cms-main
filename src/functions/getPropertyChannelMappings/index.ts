import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';

import { getPropertyChannelMappingsDocumentation } from './documentation';
import { getPropertyChannelMappingsSchema } from './schema';

const getPropertyChannelMappings: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.getPropertyChannelMappings`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getPropertyChannelMappings',
        cors: true,
        request: {
          parameters: {
            querystrings: getPropertyChannelMappingsSchema,
          },
        },
        documentation: getPropertyChannelMappingsDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default getPropertyChannelMappings;
