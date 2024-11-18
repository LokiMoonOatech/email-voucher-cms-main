import { GetRegisteredPropertyEmailQueryType } from '@definitions/inputs/get-registered-property-email.query';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { initializeMongoose, PropertyEmailRegistration } from 'src/database';

const getRegisteredPropertyEmailHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const { propertyId, channelId } =
    event.queryStringParameters as unknown as GetRegisteredPropertyEmailQueryType;

  const existingPropertyEmail = await PropertyEmailRegistration.findOne({
    propertyId,
    channelId,
  });

  if (existingPropertyEmail) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        propertyId,
        channelId,
        registeredEmail: {
          name: existingPropertyEmail.registeredName || '',
          email: existingPropertyEmail.registeredEmail,
        },
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      propertyId,
      channelId,
      registeredEmail: null,
    }),
  };
};

export const getRegisteredPropertyEmail = middyfy(
  getRegisteredPropertyEmailHandler,
);
