import { getChannelsQueryParameters } from './schema';

export const getChannelsDocumentation = {
  summary: 'Get list of registered channels',
  description: 'Get list of registered channels, with provided offset, limit.',
  tags: [],
  requestBody: {},
  requestModels: {},
  pathParams: [],
  queryParams: getChannelsQueryParameters,
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
