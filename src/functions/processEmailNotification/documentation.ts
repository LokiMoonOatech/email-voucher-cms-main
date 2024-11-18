export const processEmailNotificationDocumentation = {
  summary: 'Process email history notification push from GCP Pub/Sub',
  description:
    'When GCP Pub/Sub receives a new email history notification, it will trigger a push to this endpoint. This endpoint will process the email history notification, by extracting the necessary information from the email body and save it in the database.',
  tags: [],
  requestBody: {
    description:
      'Request body will be GCP Pub/Sub message object, which contains the email history notification. check out the documentation on https://developers.google.com/gmail/api/guides/push for more details.',
  },
  requestModels: {
    'application/json': 'ProcessEmailNotificationRequestInput',
  },
  pathParams: [],
  queryParams: [],
  cookieParams: [],
  methodResponses: [
    {
      statusCode: 200,
      responseBody: {
        description:
          'This enpoint will always return 200 to acknowledge the push even if processing was not successful. only possible error response will be the system error responses.',
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
