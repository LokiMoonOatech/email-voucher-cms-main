import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';

import { getChannelsDocumentation } from './documentation';
import { getChannelsSchema } from './schema';

const getChannels: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.getChannels`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getChannels',
        cors: true,
        request: {
          parameters: {
            querystrings: getChannelsSchema,
          },
        },
        documentation: getChannelsDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default getChannels;
