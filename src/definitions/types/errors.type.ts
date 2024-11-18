import { ParsedStandardEmailBookingData } from './parser.type';

export interface EvcmsErrorCode {
  code: number;
  message: string;
}

export class EvcmsError extends Error {
  public code: number;
  public message: string;
  public data?: string;

  constructor(
    error: EvcmsErrorCode,
    data?:
      | string
      | Partial<
          Record<string, any> & {
            parsedData: Partial<ParsedStandardEmailBookingData> | null;
          }
        >,
  ) {
    super(error.message);
    this.code = error.code;
    this.message = error.message;

    this.data =
      typeof data === 'object'
        ? JSON.stringify({
            ...data,
            ...(data.parsedData && {
              parsedData: {
                ...data.parsedData,
                guestName: '***',
                guestPhone: '***********',
              },
            }),
          })
        : data;
  }
}

export const EVCMS_ERRORS = {
  // 1000 - 1999: PARAMETER VALIDATION ERRORS
  INVALID_EVENT_BODY: {
    code: 1000,
    message: 'Invalid event body',
  },
  INVALID_PUBSUB_MESSAGE: {
    code: 1001,
    message: 'Invalid PubSub message',
  },

  // 2000 - 2999: RUNTIME ERRORS
  DUPLICATE_EMAIL: {
    code: 2000,
    message: 'Email already processed',
  },
  OUTDATED_HISTORY_ID: {
    code: 2001,
    message: 'Outdated history id',
  },
  INVALID_EMAIL_MESSAGE: {
    code: 2002,
    message: 'Invalid email message',
  },
  NO_MATCHED_RATEPLAN_MAPPING: {
    code: 2003,
    message: 'No matched rateplan mapping',
  },
  INVALID_MESSAGE_TYPE: {
    code: 2004,
    message: 'Parsed message type is not recognizable by processor',
  },

  // 3000 - 3999: INTEGRATION ERRORS
  GDS_API_ERROR: {
    code: 3000,
    message: 'GDS API error',
  },

  // 4000 - 4999: NOT FOUND ERRORS
  LABEL_NOT_FOUND: {
    code: 4000,
    message: 'Label not found',
  },
  EMAIL_NOT_FOUND: {
    code: 4001,
    message: 'Email not found',
  },
  DEFAULT_RATEPLAN_NOT_FOUND: {
    code: 4002,
    message:
      'Default rateplan not found or cannot fetch property for provided channel id.',
  },
  REGISTERED_PROPERTY_NOT_FOUND: {
    code: 4003,
    message: 'Registered property not found',
  },
  RATEPLAN_MAPPING_NOT_FOUND: {
    code: 4004,
    message: 'Rateplan mapping not found for provided property/channel id',
  },
  SLACK_WEBHOOK_NOT_FOUND: {
    code: 4005,
    message: 'Slack webhook not found',
  },
  CANCELLABLE_BOOKING_NOT_FOUND: {
    code: 4006,
    message: 'Cancellable booking not found',
  },

  // 5000 - 5999: SYSTEM ERRORS
  INTERNAL_SERVER_ERROR: {
    code: 5000,
    message: 'Internal server error',
  },
  CHANNEL_AUTHENTICATION_FAILED: {
    code: 5001,
    message: 'Channel authentication failed',
  },

  // 10000 - 19999: PROCESSING ERRORS

  // 10000 - 10999: EMAIL PARSING ERRORS

  FAILED_TO_PARSE_CHANNEL_INFO: {
    code: 10000,
    message: 'Failed to parse channel info',
  },

  FAILED_TO_PARSE_REQUIRED_FIELD: {
    code: 10001,
    message: 'Failed to parse required field',
  },

  // 40000-49999: IGNORABLE ERRORS
  PROPERTY_NOT_ENABLED: {
    code: 40000,
    message: 'Property not enabled',
  },
};
