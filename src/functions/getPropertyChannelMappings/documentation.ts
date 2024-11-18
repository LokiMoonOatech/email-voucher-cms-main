import { getPropertyChannelMappingsQueryParameters } from './schema';

export const getPropertyChannelMappingsDocumentation = {
  summary: 'Get property channel mappings',
  description: 'Search channel mappings for given property id.',
  tags: [],
  requestBody: {},
  requestModels: {},
  pathParams: [],
  queryParams: getPropertyChannelMappingsQueryParameters,
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
