import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';

import { getRegisteredPropertyEmailDocumentation } from './documentation';
import { getRegisteredPropertyEmailSchema } from './schema';

const getRegisteredPropertyEmail: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.getRegisteredPropertyEmail`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getRegisteredPropertyEmail',
        cors: true,
        request: {
          parameters: {
            querystrings: getRegisteredPropertyEmailSchema,
          },
        },
        documentation: getRegisteredPropertyEmailDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default getRegisteredPropertyEmail;
