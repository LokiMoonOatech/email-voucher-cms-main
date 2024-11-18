import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { addOrUpdateChannelAuthDocumentation } from './documentation';
import { addOrUpdateChannelAuthSchema } from './schema';

const addOrUpdateChannelAuth: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.addOrUpdateChannelAuth`,
  events: [
    {
      http: {
        method: 'post',
        path: 'addOrUpdateChannelAuth',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(
              addOrUpdateChannelAuthSchema,
            ),
          },
        },
        documentation: addOrUpdateChannelAuthDocumentation,
      },
    },
  ],
};

export default addOrUpdateChannelAuth;
