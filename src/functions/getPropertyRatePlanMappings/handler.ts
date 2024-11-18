import { GetPropertyRatePlanMappingsQueryType } from '@definitions/inputs/get-property-rateplan-mappings.query';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { initializeMongoose } from 'src/database';
import PropertyRatePlanMapping from 'src/database/models/property-rateplan-mapping.model';

const getPropertyRatePlanMappingsHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const { propertyId, channelId } =
    event.queryStringParameters as unknown as GetPropertyRatePlanMappingsQueryType;

  const existingPropertyEmail = await PropertyRatePlanMapping.findOne({
    propertyId,
    channelId,
  });

  if (existingPropertyEmail) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        propertyId: existingPropertyEmail.propertyId,
        channelId: existingPropertyEmail.channelId,
        ratePlanMappings: existingPropertyEmail.ratePlanMappings,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      propertyId,
      channelId,
      ratePlanMappings: [],
    }),
  };
};

export const getPropertyRatePlanMappings = middyfy(
  getPropertyRatePlanMappingsHandler,
);
