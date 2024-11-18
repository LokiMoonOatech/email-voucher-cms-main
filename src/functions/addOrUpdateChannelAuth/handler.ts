import { AddOrUpdateChannelAuthInputType } from '@definitions/inputs/add-or-update-channel-auth.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { ChannelAuth, initializeMongoose } from 'src/database';

const addOrUpdateChannelAuthHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const { channelId, channelGdsAccessToken }: AddOrUpdateChannelAuthInputType =
    JSON.parse(event.body || '') as AddOrUpdateChannelAuthInputType;

  const existingAuth = await ChannelAuth.findOne({
    channelId,
  });

  if (existingAuth) {
    existingAuth.channelGdsAccessToken = channelGdsAccessToken;
    await existingAuth.save();
  } else {
    const newAuth = new ChannelAuth({
      channelId,
      channelGdsAccessToken,
    });
    await newAuth.save();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Successfully updated channel auth.',
    }),
  };
};

export const addOrUpdateChannelAuth = middyfy(addOrUpdateChannelAuthHandler);
