import mongoose from 'mongoose';

export enum ParserFormat {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
}

export enum MessageType {
  CREATE = 'create',
  CANCEL = 'cancel',
}

export enum ChannelType {
  ONLY_ROOMTYPE = 'only-roomtype',
  ONLY_RATEPLAN = 'only-rateplan',
  ROOMTYPE_AND_RATEPLAN = 'roomtype-and-rateplan',
}

export interface MailParserInterface {
  parseKey: string;
  parseRegex: string;
  format?: ParserFormat;
  required: boolean;
}

export interface MailTypeParserInterface {
  type: MessageType;
  testRegex: string;
}

export interface ChannelMailParserInterface {
  channelId: number;
  type: string;
  currency: string;
  mailParser: MailParserInterface[];
}

export interface ChannelEmailRegistrationInterface {
  registeredEmail: string;
  channelId: number;
  channelAlias: string;
  channelType: ChannelType;
  mailTypeParser: MailTypeParserInterface[];
}

const MailParserSchema = new mongoose.Schema<MailParserInterface>({
  parseKey: {
    type: String,
    required: true,
  },
  parseRegex: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: ParserFormat.STRING,
    enum: ParserFormat,
  },
  required: {
    type: Boolean,
    default: true,
  },
});

const MailTypeParserSchema = new mongoose.Schema<MailTypeParserInterface>({
  type: {
    type: String,
    required: true,
    enum: MessageType,
  },
  testRegex: {
    type: String,
    required: true,
  },
});

const ChannelMailParserSchema = new mongoose.Schema<ChannelMailParserInterface>(
  {
    channelId: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
    },
    mailParser: {
      type: [MailParserSchema],
      required: true,
    },
  },
);

ChannelMailParserSchema.index(
  {
    channelId: 1,
    type: 1,
  },
  { unique: true },
);

const ChannelEmailRegistrationSchema =
  new mongoose.Schema<ChannelEmailRegistrationInterface>({
    registeredEmail: {
      type: String,
      required: true,
    },
    channelId: {
      type: Number,
      required: true,
    },
    channelAlias: {
      type: String,
      required: false,
    },
    channelType: {
      type: String,
      enum: ChannelType,
      default: ChannelType.ONLY_ROOMTYPE,
    },
    mailTypeParser: {
      type: [MailTypeParserSchema],
      required: true,
    },
  });

ChannelEmailRegistrationSchema.index({
  registeredEmail: 1,
});

const ChannelMailParser = mongoose.model<ChannelMailParserInterface>(
  'ChannelMailParser',
  ChannelMailParserSchema,
);

const ChannelEmailRegistration =
  mongoose.model<ChannelEmailRegistrationInterface>(
    'ChannelEmailRegistration',
    ChannelEmailRegistrationSchema,
  );

export { ChannelMailParser, ChannelEmailRegistration };
