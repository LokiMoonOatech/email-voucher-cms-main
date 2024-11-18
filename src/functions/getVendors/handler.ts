import { GetVendorsQueryType } from '@definitions/inputs/get-vendors.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { MotherEmailGroup, initializeMongoose } from 'src/database';

const getVendorsHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();
  const { limit, offset } =
    event.queryStringParameters as unknown as GetVendorsQueryType;

  const registeredVendors = await MotherEmailGroup.find({}, null, {
    limit: limit ? Number(limit) : 10,
    skip: offset ? Number(offset) : 0,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      vendors: registeredVendors.map((vendor) => ({
        ...vendor.toJSON(),
      })),
    }),
  };
};

export const getVendors = middyfy(getVendorsHandler);
