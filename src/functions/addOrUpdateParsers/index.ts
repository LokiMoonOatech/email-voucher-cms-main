import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { addOrUpdateParsersDocumentation } from './documentation';
import { addOrUpdateParsersSchema } from './schema';

const addOrUpdateParsers: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.addOrUpdateParsers`,
  events: [
    {
      http: {
        method: 'post',
        path: 'addOrUpdateParsers',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(
              addOrUpdateParsersSchema,
            ),
          },
        },
        documentation: addOrUpdateParsersDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default addOrUpdateParsers;
