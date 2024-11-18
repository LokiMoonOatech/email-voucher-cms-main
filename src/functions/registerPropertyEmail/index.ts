import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { registerPropertyEmailDocumentation } from './documentation';
import { registerPropertyEmailSchema } from './schema';

const registerPropertyEmail: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.registerPropertyEmail`,
  events: [
    {
      http: {
        method: 'post',
        path: 'registerPropertyEmail',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(
              registerPropertyEmailSchema,
            ),
          },
        },
        documentation: registerPropertyEmailDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default registerPropertyEmail;
