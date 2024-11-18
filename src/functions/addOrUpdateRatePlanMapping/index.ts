import { DocumentedFunctionEntry } from '@definitions/types/functions.type';
import { handlerPath } from '@libs/handler-resolver';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';

import { addOrUpdateRatePlanMappingDocumentation } from './documentation';
import { addOrUpdateRatePlanMappingSchema } from './schema';

const addOrUpdateRatePlanMapping: DocumentedFunctionEntry = {
  handler: `${handlerPath(__dirname)}/handler.addOrUpdateRatePlanMapping`,
  events: [
    {
      http: {
        method: 'post',
        path: 'addOrUpdateRatePlanMapping',
        cors: true,
        request: {
          schemas: {
            'application/json': openapiSchemaToJsonSchema(
              addOrUpdateRatePlanMappingSchema,
            ),
          },
        },
        documentation: addOrUpdateRatePlanMappingDocumentation,
      },
    },
  ],
  timeout: 30,
};

export default addOrUpdateRatePlanMapping;
