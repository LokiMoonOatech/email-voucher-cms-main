export const addOrUpdateParsersDocumentation = {
  summary: 'Add/Update main email parsers',
  description:
    'Parsers will run through the email body and extract the necessary information to be used in the registration process.',
  tags: [],
  requestBody: {
    description:
      'Mail parsers entries for specified channelId and voucher type required. mailParsers array will completely replace the existing mailParsers array.',
  },
  requestModels: {
    'application/json': 'AddOrUpdateParsersRequestInput',
  },
  pathParams: [],
  queryParams: [],
  cookieParams: [],
  methodResponses: [
    {
      statusCode: 200,
      responseBody: {
        description:
          'Successfully added/updated mail parsers. body contains the updated mailParsers array.',
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
