import { EvcmsError, EVCMS_ERRORS } from '@definitions/types/errors.type';
import { EmailData } from '@definitions/types/gmail.type';
import { ParsedStandardEmailBookingData } from '@definitions/types/parser.type';
import { PROPERTY_NAME_SEPARATOR } from '@libs/constants';
import { HydratedDocument } from 'mongoose';
import {
  ChannelMailParser,
  ChannelMailParserInterface,
  ChannelEmailRegistration,
  ChannelEmailRegistrationInterface,
  PropertyEmailRegistration,
  MailParserInterface,
  ParserFormat,
  MessageType,
} from 'src/database';
import { PropertyEmailRegistrationInterface } from 'src/database/models/property-email-registration.model';
import PropertyEvcmsEnableStatus from 'src/database/models/property-evcms-enable-status.model';
import PropertyRatePlanMapping, {
  RatePlanMapping,
} from 'src/database/models/property-rateplan-mapping.model';

import { smartParseDate } from '../date-parse';
import { refineRegExpString } from '../helpers';

interface ChannelAndType {
  channelId: number;
  channelType: string | undefined;
  messageType: MessageType | undefined;
}

const parseChannelAndType = async ({
  from,
  subject,
}: Partial<EmailData> = {}): Promise<ChannelAndType | null> => {
  if (!from || !subject) {
    return null;
  }

  const foundChannelEmailRegistration: HydratedDocument<ChannelEmailRegistrationInterface> | null =
    await ChannelEmailRegistration.findOne({
      registeredEmail: from,
    });

  if (!foundChannelEmailRegistration) {
    return null;
  }

  const { mailTypeParser, channelId, channelType } =
    foundChannelEmailRegistration;

  for (const typeParser of mailTypeParser) {
    const { type, testRegex } = typeParser;

    const regex = new RegExp(refineRegExpString(testRegex));

    if (regex.test(subject)) {
      return {
        channelId,
        channelType,
        messageType: type,
      };
    }
  }

  return {
    channelId,
    channelType,
    messageType: undefined,
  };
};

export const refineMatchDataByFormat = (
  match: string,
  parser: MailParserInterface,
) => {
  const { format } = parser;

  switch (format) {
    case ParserFormat.STRING:
      return match.trim();

    case ParserFormat.NUMBER:
      return Number(match.replace(/[^\d.]/g, ''));

    case ParserFormat.DATE:
      return smartParseDate(match.trim());

    case ParserFormat.BOOLEAN:
      return !!match;

    default:
      return match;
  }
};

export const parseAndProcessEmail = async (
  email: EmailData,
): Promise<{
  parsedData: ParsedStandardEmailBookingData;
  channelMailParser: HydratedDocument<ChannelMailParserInterface>;
}> => {
  const { from, to, subject, bodyText } = email;

  const channelInfo = await parseChannelAndType({
    from,
    subject,
  });

  if (!channelInfo) {
    throw new EvcmsError(EVCMS_ERRORS.FAILED_TO_PARSE_CHANNEL_INFO, {
      from,
      subject,
      channelInfo: null,
      missing: 'channelInfo',
    });
  }

  if (!channelInfo.messageType) {
    throw new EvcmsError(EVCMS_ERRORS.FAILED_TO_PARSE_CHANNEL_INFO, {
      from,
      subject,
      channelInfo,
      missing: 'messageType',
    });
  }

  const channelMailParser: HydratedDocument<ChannelMailParserInterface> | null =
    await ChannelMailParser.findOne({
      channelId: channelInfo.channelId,
      type: channelInfo.messageType,
    });

  if (!channelMailParser) {
    throw new EvcmsError(EVCMS_ERRORS.FAILED_TO_PARSE_CHANNEL_INFO, {
      from,
      subject,
      channelInfo,
      missing: 'channelMailParser',
    });
  }

  const { mailParser } = channelMailParser;

  const parsedData: Partial<ParsedStandardEmailBookingData> = {};

  for (const parser of mailParser) {
    const { parseKey, parseRegex, required } = parser;

    const splittedRegex = parseRegex
      .split(/(?<!\\)\/,\//g)
      .map((str) => str.replace(/^\/|\/$/g, ''));

    const [regex, multiRegex] = splittedRegex.map(
      (regexString) => new RegExp(refineRegExpString(regexString)),
    ) as [RegExp, RegExp | undefined];

    const match = regex.exec(bodyText);

    if (!match && required) {
      throw new EvcmsError(EVCMS_ERRORS.FAILED_TO_PARSE_REQUIRED_FIELD, {
        failed: parseKey,
      });
    }

    if (match) {
      if (multiRegex) {
        parsedData[parseKey] = [
          ...match[1].matchAll(new RegExp(multiRegex, 'g')),
        ].map((item) => refineMatchDataByFormat(item[1], parser));
      } else {
        parsedData[parseKey] = refineMatchDataByFormat(match[1], parser);
      }
    } else {
      parsedData[parseKey] = '';
    }
  }

  const foundRegisteredProperties = await PropertyEmailRegistration.find({
    registeredEmail: to,
  });

  let foundRegisteredProperty: HydratedDocument<PropertyEmailRegistrationInterface> | null =
    null;

  if (
    foundRegisteredProperties.length === 1 &&
    (foundRegisteredProperties[0].channelId === channelInfo.channelId ||
      !foundRegisteredProperties[0].channelId)
  ) {
    [foundRegisteredProperty] = foundRegisteredProperties;
  }

  const channelIdFilteredRegisteredProperties =
    foundRegisteredProperties.filter(
      (registeredProperty) =>
        registeredProperty.channelId === channelInfo.channelId,
    );

  if (channelIdFilteredRegisteredProperties.length === 1) {
    [foundRegisteredProperty] = channelIdFilteredRegisteredProperties;
  }

  for (const registeredProperty of foundRegisteredProperties) {
    const { channelId, registeredName } = registeredProperty;

    if (
      (channelId === channelInfo.channelId || !channelId) &&
      (registeredName?.trim() === parsedData.propertyName?.trim() ||
        registeredName
          ?.split(PROPERTY_NAME_SEPARATOR)
          .map((name) => name.trim())
          .includes(parsedData.propertyName?.trim() || ''))
    ) {
      foundRegisteredProperty = registeredProperty;
      break;
    }
  }

  if (!foundRegisteredProperty) {
    throw new EvcmsError(EVCMS_ERRORS.REGISTERED_PROPERTY_NOT_FOUND, {
      registeredEmail: to,
      parsedData,
      channelInfo,
      foundRegisteredProperties,
    });
  }

  const propertyEvcmsEnableStatus = await PropertyEvcmsEnableStatus.findOne({
    propertyId: foundRegisteredProperty.propertyId,
  });

  if (!propertyEvcmsEnableStatus?.enabled) {
    throw new EvcmsError(EVCMS_ERRORS.PROPERTY_NOT_ENABLED, {
      propertyId: foundRegisteredProperty.propertyId,
      parsedData,
    });
  }

  parsedData.propertyId = foundRegisteredProperty.propertyId;

  const propertyRatePlanMapping = await PropertyRatePlanMapping.findOne({
    propertyId: foundRegisteredProperty.propertyId,
    channelId: channelInfo.channelId,
  });

  if (!propertyRatePlanMapping) {
    throw new EvcmsError(EVCMS_ERRORS.RATEPLAN_MAPPING_NOT_FOUND, {
      propertyId: foundRegisteredProperty.propertyId,
      channelId: channelInfo.channelId,
      parsedData,
    });
  }

  const { ratePlanMappings } = propertyRatePlanMapping;

  let maxMatchedRatePlanMapping: RatePlanMapping | undefined;

  for (const mapping of ratePlanMappings) {
    const { testRegex } = mapping;

    const regex = new RegExp(refineRegExpString(testRegex, true));

    const combinedParsedName = `${parsedData.roomTypeName}${
      parsedData.ratePlanName || ''
    }`.replace(/\s/g, '');

    if (
      regex.test(combinedParsedName) &&
      (!maxMatchedRatePlanMapping ||
        maxMatchedRatePlanMapping.testRegex.length < testRegex.length)
    ) {
      maxMatchedRatePlanMapping = mapping;
    }
  }

  if (maxMatchedRatePlanMapping) {
    parsedData.ratePlanId = maxMatchedRatePlanMapping.ratePlanId;
  }

  if (!parsedData.ratePlanId) {
    throw new EvcmsError(EVCMS_ERRORS.NO_MATCHED_RATEPLAN_MAPPING, {
      propertyId: foundRegisteredProperty.propertyId,
      channelId: channelInfo.channelId,
      parsedData,
    });
  }

  parsedData.channelId = channelInfo.channelId;
  parsedData.channelType = channelInfo.channelType;
  parsedData.messageType = channelInfo.messageType;

  return {
    parsedData: parsedData as ParsedStandardEmailBookingData,
    channelMailParser,
  };
};
