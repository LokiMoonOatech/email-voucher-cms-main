import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { addOrUpdateVendorDocumentation } from './documentation';
import schema from './schema';

const addOrUpdateVendor: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.addOrUpdateVendor`,
  events: [
    {
      http: {
        method: 'post',
        path: 'addOrUpdateVendor',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(schema),
          },
        },
        documentation: addOrUpdateVendorDocumentation,
      },
    },
  ],
};

export default addOrUpdateVendor;
