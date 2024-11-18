import { AddOrUpdateRatePlanMappingInputType } from '@definitions/inputs/add-or-update-rateplan-mapping.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { HydratedDocument } from 'mongoose';
import {
  fetchPropertyRoomTypes,
  fetchPropertyRoomTypesWithRatePlans,
} from 'src/apis/gds/get-property-roomtypes.api';
import { initializeMongoose } from 'src/database';
import PropertyRatePlanMapping, {
  PropertyRatePlanMappingInterface,
  RatePlanMapping,
} from 'src/database/models/property-rateplan-mapping.model';

const addOrUpdateRatePlanMappingHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  let resultRatePlanMapping: HydratedDocument<PropertyRatePlanMappingInterface> | null;

  const {
    propertyId,
    channelId,
    ratePlanMappings,
  }: AddOrUpdateRatePlanMappingInputType = JSON.parse(
    event.body || '',
  ) as AddOrUpdateRatePlanMappingInputType;

  resultRatePlanMapping = await PropertyRatePlanMapping.findOne({
    propertyId,
    channelId,
  });

  if (!ratePlanMappings) {
    const gdsRoomTypes = await fetchPropertyRoomTypesWithRatePlans({
      propertyId,
      channelId,
    });

    const generatedRatePlanMappings: RatePlanMapping[] = [];

    for (const gdsRoomType of gdsRoomTypes) {
      for (const ratePlan of gdsRoomType.ratePlans) {
        generatedRatePlanMappings.push({
          roomTypeId: +gdsRoomType.id,
          ratePlanId: +ratePlan.id,
          testRegex: ratePlan.name,
        });
      }
    }

    if (resultRatePlanMapping) {
      resultRatePlanMapping.ratePlanMappings = generatedRatePlanMappings;
      await resultRatePlanMapping.save();
    } else {
      resultRatePlanMapping = new PropertyRatePlanMapping({
        propertyId,
        channelId,
        ratePlanMappings: generatedRatePlanMappings,
      });

      await resultRatePlanMapping.save();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(resultRatePlanMapping),
    };
  }

  if (resultRatePlanMapping) {
    resultRatePlanMapping.ratePlanMappings = ratePlanMappings;
    await resultRatePlanMapping.save();
  } else {
    resultRatePlanMapping = new PropertyRatePlanMapping({
      propertyId,
      channelId,
      ratePlanMappings,
    });

    await resultRatePlanMapping.save();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(resultRatePlanMapping),
  };
};

export const addOrUpdateRatePlanMapping = middyfy(
  addOrUpdateRatePlanMappingHandler,
);
