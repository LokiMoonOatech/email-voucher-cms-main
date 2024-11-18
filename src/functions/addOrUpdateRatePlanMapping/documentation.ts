export const addOrUpdateRatePlanMappingDocumentation = {
  summary: 'Add/Update rate plan mapping',
  description:
    'Create or Update rateplan mapping entries in the database, with provided propertyId, channelId, ratePlanMappings. if ratePlanMappings is not provided, it will be generated automatically based on the existing rateplans in the GDS system.',
  tags: [],
  requestBody: {
    description:
      'Rateplan mapping entries for specified propertyId and channelId required. ratePlanMappings array will completely replace the existing ratePlanMappings array.',
  },
  requestModels: {
    'application/json': 'AddOrUpdateRatePlanMappingRequestInput',
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
