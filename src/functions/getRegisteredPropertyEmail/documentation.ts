import { getRegisteredPropertyEmailQueryParameters } from './schema';

export const getRegisteredPropertyEmailDocumentation = {
  summary: 'Get registered property email',
  description: 'Search registered property email information by property id.',
  tags: [],
  requestBody: {},
  requestModels: {},
  pathParams: [],
  queryParams: getRegisteredPropertyEmailQueryParameters,
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
