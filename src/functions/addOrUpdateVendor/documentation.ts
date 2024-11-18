export const addOrUpdateVendorDocumentation = {
  summary: 'Add or update vendor and its registered mother email group',
  description:
    'Creates new mother email group entry in the database, with provided labelName, vendorId, vendorAlias with email registration.',
  tags: [],
  requestBody: {
    description: 'Mother email group object',
  },
  requestModels: {
    'application/json': 'AddOrUpdateVendorRequestInput',
  },
  pathParams: [],
  queryParams: [],
  cookieParams: [],
  methodResponses: [
    {
      statusCode: 200,
      responseBody: {
        description: 'Mother email group success response',
      },
      responseModels: {
        'application/json': 'SuccessResponse',
      },
    },
    {
      statusCode: 400,
      responseBody: {
        description: 'An error message when creating a new mother email group',
      },
      responseModels: {
        'application/json': 'ErrorResponse',
      },
    },
  ],
};
