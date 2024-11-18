import { GetChannelsQueryType } from '@definitions/inputs/get-channels.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import {
  ChannelAuth,
  ChannelEmailRegistration,
  initializeMongoose,
} from 'src/database';

const getChannelsHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();
  const { limit, offset } =
    event.queryStringParameters as unknown as GetChannelsQueryType;

  const foundRegisteredChannels = await ChannelEmailRegistration.find(
    {},
    null,
    {
      limit: limit ? Number(limit) : 10,
      skip: offset ? Number(offset) : 0,
    },
  );

  const foundChannelAuths = await ChannelAuth.find({
    channelId: {
      $in: foundRegisteredChannels.map((channel) => channel.channelId),
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      channels: foundRegisteredChannels.map((channel) => ({
        ...channel.toJSON(),
        channelGdsAccessToken: foundChannelAuths.find(
          (auth) => auth.channelId === channel.channelId,
        )?.channelGdsAccessToken,
      })),
    }),
  };
};

export const getChannels = middyfy(getChannelsHandler);
