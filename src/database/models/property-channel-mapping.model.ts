import mongoose from 'mongoose';

export interface PropertyChannelMappingInterface {
  propertyId: number;
  channelId: number;
}

const PropertyChannelMappingSchema =
  new mongoose.Schema<PropertyChannelMappingInterface>({
    propertyId: {
      type: Number,
      required: true,
    },
    channelId: {
      type: Number,
      required: true,
    },
  });

// set index for propertyId, registeredEmail
PropertyChannelMappingSchema.index({ propertyId: 1, registeredEmail: 1 });

const PropertyChannelMapping = mongoose.model<PropertyChannelMappingInterface>(
  'PropertyChannelMapping',
  PropertyChannelMappingSchema,
);

export default PropertyChannelMapping;
