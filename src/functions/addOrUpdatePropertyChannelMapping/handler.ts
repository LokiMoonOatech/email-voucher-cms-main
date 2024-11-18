import { AddOrUpdatePropertyChannelMappingInput } from '@definitions/inputs/add-or-update-property-channel-mapping.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { HydratedDocument } from 'mongoose';
import { ChannelEmailRegistration, initializeMongoose } from 'src/database';
import PropertyChannelMapping, {
  PropertyChannelMappingInterface,
} from 'src/database/models/property-channel-mapping.model';
import PropertyEvcmsEnableStatus from 'src/database/models/property-evcms-enable-status.model';

const addOrUpdatePropertyChannelMappingHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const {
    channelIds,
    propertyId,
    enabled,
    agreedToTerms,
  }: AddOrUpdatePropertyChannelMappingInput = JSON.parse(
    event.body || '',
  ) as AddOrUpdatePropertyChannelMappingInput;

  const propertyEnableStatus = await PropertyEvcmsEnableStatus.findOneAndUpdate(
    {
      propertyId,
    },
    {
      propertyId,
      enabled,
      agreedToTerms,
    },
    {
      upsert: true,
      new: true,
    },
  );

  const resultPropertyMappings: HydratedDocument<PropertyChannelMappingInterface>[] =
    [];

  if (channelIds) {
    const registeredChannels = await ChannelEmailRegistration.find({
      channelId: { $in: channelIds },
    });

    if (registeredChannels.length !== channelIds.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Some of the channels are not registered',
          missingChannelIds: channelIds.filter(
            (channelId) =>
              !registeredChannels.some(
                (registeredChannel) =>
                  registeredChannel.channelId === channelId,
              ),
          ),
        }),
      };
    }
    const existingPropertyChannelMappings = await PropertyChannelMapping.find({
      propertyId,
    });

    await Promise.all(
      existingPropertyChannelMappings.map(async (mapping) => {
        if (!channelIds.includes(mapping.channelId)) {
          return mapping.deleteOne();
        }
        resultPropertyMappings.push(mapping);
      }),
    );

    const createdMappings = await Promise.all(
      channelIds.map(async (channelId) => {
        if (
          !existingPropertyChannelMappings.some(
            (mapping) => mapping.channelId === channelId,
          )
        ) {
          return PropertyChannelMapping.create({
            propertyId,
            channelId,
          });
        }
      }),
    );

    resultPropertyMappings.push(
      ...(createdMappings.filter(
        (mapping) => !!mapping,
      ) as HydratedDocument<PropertyChannelMappingInterface>[]),
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      propertyId,
      channelIds,
      enabled: propertyEnableStatus.enabled || false,
      propertyChannelMappings: resultPropertyMappings.map((mapping) => ({
        propertyId: mapping.propertyId,
        channelId: mapping.channelId,
      })),
    }),
  };
};

export const addOrUpdatePropertyChannelMapping = middyfy(
  addOrUpdatePropertyChannelMappingHandler,
);
