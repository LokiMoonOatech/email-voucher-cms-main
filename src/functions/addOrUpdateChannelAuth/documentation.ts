export const addOrUpdateChannelAuthDocumentation = {
  summary: 'Add/Update channel auth tokens',
  description:
    'Registers and save channel auth tokens in the database, with provided channelId and channelGdsAccessToken.',
  tags: [],
  requestBody: {
    description: 'A pair of channelId and channelGdsAccessToken entry',
  },
  requestModels: {
    'application/json': 'AddOrUpdateChannelAuthRequestInput',
  },
  pathParams: [],
  queryParams: [],
  cookieParams: [],
  methodResponses: [
    {
      statusCode: 200,
      responseBody: {
        description: 'Successfully added/updated channel auth tokens',
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
