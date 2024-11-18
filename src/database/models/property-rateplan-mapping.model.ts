import mongoose from 'mongoose';

export interface RatePlanMapping {
  roomTypeId: number;
  ratePlanId: number;
  testRegex: string;
}

export interface PropertyRatePlanMappingInterface {
  propertyId: number;
  channelId: number;
  ratePlanMappings: RatePlanMapping[];
}

const RatePlanMappingSchema = new mongoose.Schema<RatePlanMapping>({
  roomTypeId: {
    type: Number,
    required: true,
  },
  ratePlanId: {
    type: Number,
    required: true,
  },
  testRegex: {
    type: String,
    required: true,
  },
});

const PropertyRatePlanMappingSchema =
  new mongoose.Schema<PropertyRatePlanMappingInterface>({
    propertyId: {
      type: Number,
      required: true,
    },
    channelId: {
      type: Number,
      required: true,
    },
    ratePlanMappings: {
      type: [RatePlanMappingSchema],
      required: true,
    },
  });

// set index for propertyId, ratePlanId
PropertyRatePlanMappingSchema.index(
  { propertyId: 1, channelId: 1 },
  { unique: true },
);

const PropertyRatePlanMapping =
  mongoose.model<PropertyRatePlanMappingInterface>(
    'PropertyRatePlanMapping',
    PropertyRatePlanMappingSchema,
  );

export default PropertyRatePlanMapping;
