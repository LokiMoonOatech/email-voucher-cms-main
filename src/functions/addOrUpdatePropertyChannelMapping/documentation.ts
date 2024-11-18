export const addOrUpdatePropertyChannelMappingDocumentation = {
  summary: 'Add/Update property <> channel mapping master configuration',
  description:
    'Enable/Disable channel mapping status for specific property. Enabling channels will grant the property access to register interlock configurations for enabled channels.',
  tags: [],
  requestBody: {
    description: 'Channel Id array to override current channel mapping.',
  },
  requestModels: {
    'application/json': 'AddOrUpdatePropertyChannelMappingRequestInput',
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
