export const getPropertyChannelMappingsQueryParameters = [
  {
    name: 'propertyId',
    description: 'propertyId stands for the GDS property id.',
    required: true,
    schema: {
      type: 'number',
    },
  },
];

export const getPropertyChannelMappingsSchema = {
  propertyId: true,
};
