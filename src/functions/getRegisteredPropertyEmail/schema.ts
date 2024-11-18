export const getRegisteredPropertyEmailQueryParameters: any = [
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
    description: 'channelId stands for the GDS channel id.',
    required: false,
    schema: {
      type: 'number',
    },
  },
];

export const getRegisteredPropertyEmailSchema = {
  propertyId: true,
  channelId: false,
};
