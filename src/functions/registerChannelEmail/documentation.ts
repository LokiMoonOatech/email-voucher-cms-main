export const registerChannelEmailDocumentation = {
  summary: 'Register channel email',
  description:
    'This endpoint will register the channel email addresses to the system. email type will be parsed based on the regex provided. if the email type is not detected, the email will be ignored.',
  tags: [],
  requestBody: {
    description:
      'channelId, registeredEmail and mailTypeParser are required. mailTypeParser is an array of objects with type and testRegex properties. type is the email type and testRegex is the regex to be used to detect the email type.',
  },
  requestModels: {
    'application/json': 'RegisterChannelEmailRequestInput',
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
