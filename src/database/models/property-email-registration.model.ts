import mongoose from 'mongoose';

export interface PropertyEmailRegistrationInterface {
  propertyId: number;
  registeredEmail: string;
  registeredName?: string;
  channelId?: number;
}

const PropertyEmailRegistrationSchema =
  new mongoose.Schema<PropertyEmailRegistrationInterface>({
    propertyId: {
      type: Number,
      required: true,
    },
    registeredEmail: {
      type: String,
      required: true,
    },
    registeredName: {
      type: String,
    },
    channelId: {
      type: Number,
    },
  });

// set index for propertyId, registeredEmail
PropertyEmailRegistrationSchema.index({ propertyId: 1, registeredEmail: 1 });

const PropertyEmailRegistration =
  mongoose.model<PropertyEmailRegistrationInterface>(
    'PropertyEmailRegistration',
    PropertyEmailRegistrationSchema,
  );

export default PropertyEmailRegistration;
