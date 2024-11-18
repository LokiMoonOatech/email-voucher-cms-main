export const getPropertyEvcmsEnableStatusesQueryParameters = [
  {
    name: 'offset',
    description: 'current page number',
    required: true,
    schema: {
      type: 'number',
    },
  },
  {
    name: 'limit',
    description: 'number of items per page',
    required: true,
    schema: {
      type: 'number',
    },
  },
  {
    name: 'enabled',
    description: 'filter by enabled status',
    required: false,
    schema: {
      type: 'boolean',
    },
  },
];

export const getPropertyEvcmsEnableStatusesSchema = {
  offset: true,
  limit: true,
  enabled: false,
};
