export const slackActionHandlerDocumentation = {
  summary: 'Slack interactive message action handler',
  description: 'Slack interactive message action handler',
  tags: [],
  requestBody: {
    description: 'Slack interactive message action payload',
  },
  requestModels: {
    'application/json': 'SlackBlockitActionPayload',
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
