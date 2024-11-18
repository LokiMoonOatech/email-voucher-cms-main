import { MessageStatus } from '@definitions/types/gmail.type';
import mongoose from 'mongoose';

export interface ProcessedMessageInterface {
  id: string;
  historyId: number;
  batchHistoryId: number;
  bookingNumber?: string;
  gdsBookingNumber?: string;
  subject?: string;
  status: MessageStatus;
  errorData?: object;
  parsedData?: object;
}

const ProcessedMessageSchema = new mongoose.Schema<ProcessedMessageInterface>({
  id: {
    type: String,
    required: true,
  },
  historyId: {
    type: Number,
    required: true,
  },
  batchHistoryId: {
    type: Number,
    required: true,
  },
  bookingNumber: {
    type: String,
  },
  gdsBookingNumber: {
    type: String,
  },
  subject: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(MessageStatus),
    required: true,
    default: 'received',
  } as mongoose.SchemaDefinitionProperty<MessageStatus> | undefined,
  errorData: {
    type: Object,
  },
  parsedData: {
    type: Object,
  },
});

// set index for id, batchHistoryId. unique constraint for id only, batchHistoryId can be duplicated.

ProcessedMessageSchema.index({ id: 1 }, { unique: true });
ProcessedMessageSchema.index({ gdsBookingNumber: 1 });
ProcessedMessageSchema.index({ bookingNumber: 1 });
ProcessedMessageSchema.index({ batchHistoryId: 1 });

const ProcessedMessage = mongoose.model<ProcessedMessageInterface>(
  'ProcessedMessage',
  ProcessedMessageSchema,
);

export default ProcessedMessage;
