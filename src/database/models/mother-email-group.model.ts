import mongoose from 'mongoose';

interface MotherEmailGroupInterface {
  labelId: string;
  labelName: string;
  vendorAlias: string;
  vendorId: string;
  groupEmail: string;
}

const MotherEmailGroupSchema = new mongoose.Schema<MotherEmailGroupInterface>({
  labelId: {
    type: String,
    required: true,
  },
  labelName: {
    type: String,
    required: true,
  },
  vendorAlias: {
    type: String,
    required: true,
  },
  vendorId: {
    type: String,
    required: true,
  },
  groupEmail: {
    type: String,
    required: true,
  },
});

// set index for labelId, vendorId, groupEmail
MotherEmailGroupSchema.index(
  { labelId: 1, vendorId: 1, groupEmail: 1 },
  { unique: true },
);

const MotherEmailGroup = mongoose.model<MotherEmailGroupInterface>(
  'MotherEmailGroup',
  MotherEmailGroupSchema,
);

export default MotherEmailGroup;
