import { getPropertyRateplanMappingsQueryParameters } from './schema';

export const getPropertyRateplanMappingsDocumentation = {
  summary: 'Get registered raetplan mappings of specified property',
  description:
    'Search and retreive all registered rateplan mappings by property id',
  tags: [],
  requestBody: {},
  requestModels: {},
  pathParams: [],
  queryParams: getPropertyRateplanMappingsQueryParameters,
  cookieParams: [],
  methodResponses: [
    {
      statusCode: 200,
      responseBody: {
        description: 'A Success message will be returned.',
      },
      responseModels: {
        'application/json': 'SuccessResponse',
      },
    },
    {
      statusCode: 500,
      responseBody: {
        description: 'System error responses',
      },
      responseModels: {
        'application/json': 'ErrorResponse',
      },
    },
  ],
};
