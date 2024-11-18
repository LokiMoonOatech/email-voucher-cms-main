import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { registerChannelEmailDocumentation } from './documentation';
import { registerChannelEmailSchema } from './schema';

const registerChannelEmail: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.registerChannelEmail`,
  events: [
    {
      http: {
        method: 'post',
        path: 'registerChannelEmail',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(
              registerChannelEmailSchema,
            ),
          },
        },
        documentation: registerChannelEmailDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default registerChannelEmail;
