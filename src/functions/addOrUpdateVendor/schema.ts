export default {
  type: 'object',
  properties: {
    labelName: { type: 'string', example: '총판 오아테크' },
    vendorAlias: { type: 'string', example: 'vendor-dev-test-1' },
    vendorId: { type: 'string', example: 'oatech' },
    groupEmail: { type: 'string', example: '201-booking.onda.me' },
  },
  required: ['labelName', 'vendorAlias', 'vendorId', 'groupEmail'],
};
