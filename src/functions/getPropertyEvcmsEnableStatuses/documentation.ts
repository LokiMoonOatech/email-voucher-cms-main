import { getPropertyEvcmsEnableStatusesQueryParameters } from './schema';

export const getPropertyEvcmsEnableStatusesDocumentation = {
  summary: 'Get list of property evcms enable statuses',
  description:
    'Get list of property evcms enable statuses. This endpoint is used to get list of property evcms enable statuses.',
  tags: [],
  requestBody: {},
  requestModels: {},
  pathParams: [],
  queryParams: getPropertyEvcmsEnableStatusesQueryParameters,
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
