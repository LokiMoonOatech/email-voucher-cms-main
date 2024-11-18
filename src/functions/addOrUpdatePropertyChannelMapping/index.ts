import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { addOrUpdatePropertyChannelMappingDocumentation } from './documentation';
import { addOrUpdatePropertyChannelMappingSchema } from './schema';

const addOrUpdatePropertyChannelMapping: DocumentedFunctionEntry = {
  handler: `${handlerPath(
    __dirname,
  )}/handler.addOrUpdatePropertyChannelMapping`,
  events: [
    {
      http: {
        method: 'post',
        path: 'addOrUpdatePropertyChannelMapping',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(
              addOrUpdatePropertyChannelMappingSchema,
            ),
          },
        },
        documentation: addOrUpdatePropertyChannelMappingDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default addOrUpdatePropertyChannelMapping;
