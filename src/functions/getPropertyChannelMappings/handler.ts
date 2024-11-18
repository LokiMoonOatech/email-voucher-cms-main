import { GetPropertyChannelMappingsQueryType } from '@definitions/inputs/get-property-channel-mapping.query';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { HydratedDocument } from 'mongoose';
import {
  ChannelEmailRegistration,
  ChannelEmailRegistrationInterface,
  ChannelType,
  initializeMongoose,
} from 'src/database';
import PropertyChannelMapping from 'src/database/models/property-channel-mapping.model';
import PropertyEvcmsEnableStatus from 'src/database/models/property-evcms-enable-status.model';

const getPropertyChannelMappingsHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const { propertyId } =
    event.queryStringParameters as unknown as GetPropertyChannelMappingsQueryType;

  const propertyEnableStatus = await PropertyEvcmsEnableStatus.findOne({
    propertyId,
  });

  const channelMappings = await PropertyChannelMapping.find({
    propertyId,
  });

  if (channelMappings.length > 0) {
    const channelRegistrations = await ChannelEmailRegistration.find({
      channelId: channelMappings.map(
        (channelMapping) => channelMapping.channelId,
      ),
    });

    const channelIdRegistrationMap = new Map<
      number,
      HydratedDocument<ChannelEmailRegistrationInterface>
    >();

    for (const channelRegistration of channelRegistrations) {
      channelIdRegistrationMap.set(
        channelRegistration.channelId,
        channelRegistration,
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        propertyId,
        enabled: propertyEnableStatus?.enabled || false,
        agreedToTerms: propertyEnableStatus?.agreedToTerms || false,
        channelMappings: channelMappings.map((channelMapping) => ({
          channelId: channelMapping.channelId,
          propertyId: channelMapping.propertyId,
          alias:
            channelIdRegistrationMap.get(channelMapping.channelId)
              ?.channelAlias || 'N/A',
          type:
            channelIdRegistrationMap.get(channelMapping.channelId)
              ?.channelType || ChannelType.ONLY_ROOMTYPE,
        })),
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      propertyId,
      enabled: propertyEnableStatus?.enabled || false,
      agreedToTerms: propertyEnableStatus?.agreedToTerms || false,
      channelMappings: [],
    }),
  };
};

export const getPropertyChannelMappings = middyfy(
  getPropertyChannelMappingsHandler,
);
