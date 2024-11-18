import mongoose from 'mongoose';

export interface GmailMetaDataInterface {
  latestHistoryId: number;
  userId: string;
}

const GmailMetaDataSchema = new mongoose.Schema<GmailMetaDataInterface>({
  latestHistoryId: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

// set index for labelId, vendorId, groupEmail
GmailMetaDataSchema.index({ userId: 1 }, { unique: true });

const GmailMetaData = mongoose.model<GmailMetaDataInterface>(
  'GmailMetaData',
  GmailMetaDataSchema,
);

export default GmailMetaData;
