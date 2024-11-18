import { RegisterChannelEmailInputType } from '@definitions/inputs/register-channel-email.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { ChannelEmailRegistration, initializeMongoose } from 'src/database';

const registerChannelEmailHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const {
    registeredEmail,
    channelId,
    channelAlias,
    mailTypeParser,
  }: RegisterChannelEmailInputType = JSON.parse(
    event.body || '',
  ) as RegisterChannelEmailInputType;

  const existingChannelEmailRegistration =
    await ChannelEmailRegistration.findOne({
      channelId,
    });

  if (existingChannelEmailRegistration) {
    existingChannelEmailRegistration.registeredEmail = registeredEmail;
    existingChannelEmailRegistration.mailTypeParser = mailTypeParser;
    existingChannelEmailRegistration.channelAlias = channelAlias;
    await existingChannelEmailRegistration.save();
  } else {
    const createdChannelEmailRegistration = new ChannelEmailRegistration({
      registeredEmail,
      channelId,
      channelAlias,
      mailTypeParser,
    });
    await createdChannelEmailRegistration.save();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Successfully registered channel email.',
    }),
  };
};
export const registerChannelEmail = middyfy(registerChannelEmailHandler);
