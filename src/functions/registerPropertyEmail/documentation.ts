export const registerPropertyEmailDocumentation = {
  summary: 'Register property email',
  description:
    'This endpoint will register the property email addresses to the system, with the propertyId and channelId.',
  tags: [],
  requestBody: {
    description:
      'While parsing new email, the system will check if name of property matches registeredName. If no match was found and there are more than one property with the same email, the system will return an error. If there is only one property with the same email, the system will assume that the email belongs to that property.',
  },
  requestModels: {
    'application/json': 'RegisterPropertyEmailRequestInput',
  },
  pathParams: [],
  queryParams: [],
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
