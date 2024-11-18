import { GetPropertyEnableStatusesQueryType } from '@definitions/inputs/get-property-enable-statuses.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { initializeMongoose } from 'src/database';
import PropertyEvcmsEnableStatus from 'src/database/models/property-evcms-enable-status.model';

const getPropertyEvcmsEnableStatusesHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();
  const { limit, offset, enabled } =
    event.queryStringParameters as unknown as GetPropertyEnableStatusesQueryType;

  const foundPropertyEnableStatuses = await PropertyEvcmsEnableStatus.find(
    {
      ...(enabled !== undefined && { enabled }),
    },
    null,
    {
      limit: limit || 10,
      skip: offset || 0,
    },
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      propertyEnableStatuses: foundPropertyEnableStatuses.map((status) => ({
        propertyId: status.propertyId,
        enabled: status.enabled,
      })),
    }),
  };
};

export const getPropertyEnableStatuses = middyfy(
  getPropertyEvcmsEnableStatusesHandler,
);
