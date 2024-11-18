export const getChannelsQueryParameters = [
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
];

export const getChannelsSchema = {
  offset: true,
  limit: true,
};
