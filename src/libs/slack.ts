import { EvcmsError } from '@definitions/types/errors.type';
import { HydratedDocument } from 'mongoose';
import fetch from 'node-fetch';
import { ProcessedMessageInterface } from 'src/database/models/processed-message.model';

const safeParse = (data: string): unknown => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return data;
  }
};

export const formatEmailError = (
  error,
  emailData?: HydratedDocument<ProcessedMessageInterface> | null,
) => {
  return {
    text: 'incoming-webhook',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*이메일 바우처 예약 연동 오류가 발생했습니다.*',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*에러 메시지:*\n${error.message}`,
          },
          {
            type: 'mrkdwn',
            text: `*발생일시:*\n${new Date().toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
            })}`,
          },
          ...(emailData
            ? [
                {
                  type: 'mrkdwn',
                  text: `*Event History ID:*\n${
                    emailData.batchHistoryId || '-'
                  }`,
                },
                {
                  type: 'mrkdwn',
                  text: `*메일 History ID:*\n${emailData.historyId}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*메일 Message ID:*\n${emailData.id}`,
                },
              ]
            : []),
        ],
      },
      ...(emailData?.subject
        ? [
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*메일 제목:*\n${emailData.subject}`,
                },
              ],
            },
          ]
        : []),
      ...(emailData?.parsedData
        ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*파싱된 데이터:*\n\`\`\`${JSON.stringify(
                  emailData.parsedData,
                  null,
                  2,
                )}\`\`\``,
              },
            },
          ]
        : []),
      ...(emailData?.errorData
        ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*에러 데이터:*\n\`\`\`${JSON.stringify(
                  {
                    ...emailData.errorData,
                    data:
                      (emailData.errorData as EvcmsError).data &&
                      safeParse((emailData.errorData as EvcmsError).data || ''),
                  },
                  null,
                  2,
                )}\`\`\``,
              },
            },
          ]
        : []),
      {
        type: 'divider',
      },
    ],
    ...(emailData?.errorData && {
      attachments: [
        {
          text: '연동 재시도 옵션',
          fallback: '연동 재시도에 실패했습니다.',
          callback_id: 'evcms_retry',
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'retry',
              text: '연동 재시도',
              type: 'button',
              value: emailData.id,
              confirm: {
                title: '연동 재시도',
                text: '해당 메일을 다시 연동하도록 요청합니다.',
                ok_text: '네',
                dismiss_text: '아니오',
              },
            },
          ],
        },
      ],
    }),
  };
};

export const postSlackMessage = async (
  payload: any,
  { url }: { url?: string } = {},
) => {
  console.log('Posting slack message', payload);
  const slackMessageResult = await fetch(
    url || (process.env.SLACK_ERROR_WEBHOOK as unknown as URL),
    {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  console.log(slackMessageResult);

  return slackMessageResult;
};
