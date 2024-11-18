import { SlackBlockActionPayloadInputType } from '@definitions/inputs/slack-block-action-payload.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { processEmail } from '@libs/email/process';
import { middyfy } from '@libs/lambda';
import { postSlackMessage } from '@libs/slack';
import { APIGatewayEvent, Handler } from 'aws-lambda';

const handleSlackActionHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  const payloadRaw = event.body || '';

  const parsedPayload: SlackBlockActionPayloadInputType = JSON.parse(
    decodeURIComponent(payloadRaw).split('payload=')[1],
  ) as unknown as SlackBlockActionPayloadInputType;

  const {
    response_url: responseUrl,
    actions,
    user: { name },
  } = parsedPayload;

  const { value } = actions[0];

  await postSlackMessage(
    {
      text: `${value} 이메일에 대한 연동을 재시도합니다. (요청자: ${name})\n'문제가 발생했습니다. 다시 시도해주세요.' 문구가 뜨더라도 재시도하지 마세요! 이 메시지가 보인다면 연동 재시도를 처리중인 상태입니다.`,
      replace_original: false,
      response_type: 'in_channel',
    },
    {
      url: responseUrl,
    },
  );

  const retryResult = await processEmail({
    historyId: '',
    messageId: value,
    isRetry: true,
  });

  await (retryResult
    ? postSlackMessage(
        {
          text: `${value} 이메일 연동을 재시도하여, 예약이 성공적으로 등록되었습니다.`,
          replace_original: false,
          response_type: 'in_channel',
        },
        {
          url: responseUrl,
        },
      )
    : postSlackMessage(
        {
          text: `${value} 이메일 연동을 재시도하였으나 예약 등록에 실패했습니다.`,
          replace_original: false,
          response_type: 'in_channel',
        },
        {
          url: responseUrl,
        },
      ));

  return {
    statusCode: 200,
    body: '',
  };
};
export const handleSlackAction = middyfy(handleSlackActionHandler);
