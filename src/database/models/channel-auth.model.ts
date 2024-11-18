import mongoose from 'mongoose';

interface ChannelAuthInterface {
  channelId: number;
  channelAlias: string;
  channelGdsAccessToken: string;
}

const ChannelAuthSchema = new mongoose.Schema<ChannelAuthInterface>({
  channelId: {
    type: Number,
    required: true,
  },
  channelGdsAccessToken: {
    type: String,
    required: true,
  },
});

ChannelAuthSchema.index({ channelId: 1 }, { unique: true });

const ChannelAuth = mongoose.model<ChannelAuthInterface>(
  'ChannelAuth',
  ChannelAuthSchema,
);

export default ChannelAuth;
