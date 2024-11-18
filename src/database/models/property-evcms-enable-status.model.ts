import mongoose from 'mongoose';

export interface PropertyEvcmsEnableStatusInterface {
  propertyId: number;
  enabled: boolean;
  agreedToTerms?: boolean;
}

const PropertyEvcmsEnableStatusSchema =
  new mongoose.Schema<PropertyEvcmsEnableStatusInterface>({
    propertyId: {
      type: Number,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
    agreedToTerms: {
      type: Boolean,
      default: false,
    },
  });

// set index for propertyId, registeredEmail
PropertyEvcmsEnableStatusSchema.index({ propertyId: 1 });

const PropertyEvcmsEnableStatus =
  mongoose.model<PropertyEvcmsEnableStatusInterface>(
    'PropertyEvcmsEnableStatus',
    PropertyEvcmsEnableStatusSchema,
  );

export default PropertyEvcmsEnableStatus;
