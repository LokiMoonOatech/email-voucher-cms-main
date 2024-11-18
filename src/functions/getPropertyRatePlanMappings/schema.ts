export const getPropertyRateplanMappingsQueryParameters: any = [
  {
    name: 'propertyId',
    description: 'propertyId stands for the GDS property id.',
    required: true,
    schema: {
      type: 'number',
    },
  },
  {
    name: 'channelId',
    description: 'channelId stands for the GDS property id.',
    required: true,
    schema: {
      type: 'number',
    },
  },
];

export const getPropertyRatePlanMappingsSchema = {
  propertyId: true,
  channelId: true,
};
