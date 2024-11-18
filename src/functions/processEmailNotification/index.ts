import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { processEmailNotificationDocumentation } from './documentation';
import { processEmailNotificationSchema } from './schema';

const processEmailNotification: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.processEmailNotification`,
  events: [
    {
      http: {
        method: 'post',
        path: 'processEmailNotification',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(
              processEmailNotificationSchema,
            ),
          },
        },
        documentation: processEmailNotificationDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default processEmailNotification;
