import { getVendorsQueryParameters } from './schema';

export const getVendorsDocumentation = {
  summary: 'Get list of registered vendors',
  description: 'Get list of registered vendors, with provided offset, limit.',
  tags: [],
  requestBody: {},
  requestModels: {},
  pathParams: [],
  queryParams: getVendorsQueryParameters,
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
