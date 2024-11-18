import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { slackActionHandlerDocumentation } from './documentation';
import { slackBlockActionPayloadSchema } from './schema';

const handleSlackAction: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.handleSlackAction`,
  events: [
    {
      http: {
        method: 'post',
        path: 'slack',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(
              slackBlockActionPayloadSchema,
            ),
          },
        },
        documentation: slackActionHandlerDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default handleSlackAction;
