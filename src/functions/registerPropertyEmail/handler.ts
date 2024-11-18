import { RegisterPropertyEmailInputType } from '@definitions/inputs/register-property-email.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { initializeMongoose, PropertyEmailRegistration } from 'src/database';

const registerPropertyEmailHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const {
    registeredEmail,
    registeredName,
    channelId,
    propertyId,
  }: RegisterPropertyEmailInputType = JSON.parse(
    event.body || '',
  ) as RegisterPropertyEmailInputType;

  const existingPropertyEmail = await PropertyEmailRegistration.findOne({
    propertyId,
    channelId,
  });

  if (existingPropertyEmail) {
    existingPropertyEmail.registeredEmail = registeredEmail;
    existingPropertyEmail.registeredName = registeredName;
    await existingPropertyEmail.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        propertyId: existingPropertyEmail.propertyId,
        channelId: existingPropertyEmail.channelId,
        registeredEmail: existingPropertyEmail.registeredEmail,
        registeredName: existingPropertyEmail.registeredName,
      }),
    };
  }

  const newPropertyEmail = new PropertyEmailRegistration({
    propertyId,
    channelId,
    registeredEmail,
    registeredName,
  });

  await newPropertyEmail.save();

  return {
    statusCode: 200,
    body: JSON.stringify({
      propertyId: newPropertyEmail.propertyId,
      channelId: newPropertyEmail.channelId,
      registeredEmail: newPropertyEmail.registeredEmail,
      registeredName: newPropertyEmail.registeredName,
    }),
  };
};

export const registerPropertyEmail = middyfy(registerPropertyEmailHandler);
