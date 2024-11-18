import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';

import { getVendorsDocumentation } from './documentation';
import { getVendorsSchema } from './schema';

const getVendors: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.getVendors`,
  events: [
    {
      http: {
        method: 'get',
        path: 'getVendors',
        cors: true,
        request: {
          parameters: {
            querystrings: getVendorsSchema,
          },
        },
        documentation: getVendorsDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default getVendors;
