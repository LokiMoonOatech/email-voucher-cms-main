import { AddOrUpdateParsersInputType } from '@definitions/inputs/add-or-update-parsers.input';
import { HttpFunctionReturnType } from '@definitions/types/functions.type';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, Handler } from 'aws-lambda';
import { ChannelMailParser, initializeMongoose } from 'src/database';

const addOrUpdateParsersHandler: Handler = async (
  event: APIGatewayEvent,
): Promise<HttpFunctionReturnType> => {
  await initializeMongoose();

  const { channelId, type, mailParser }: AddOrUpdateParsersInputType =
    JSON.parse(event.body || '') as AddOrUpdateParsersInputType;

  const existingChannelMailParser = await ChannelMailParser.findOne({
    channelId,
    type,
  });

  if (existingChannelMailParser) {
    const { mailParser: existingMailParser } = existingChannelMailParser;

    const updatedMailParser = mailParser.map((parser) => {
      const existingParser = existingMailParser.find(
        (existing) => existing.parseKey === parser.parseKey,
      );

      if (existingParser) {
        return {
          ...existingParser,
          ...parser,
        };
      }

      return parser;
    });

    existingChannelMailParser.mailParser = updatedMailParser;
    await existingChannelMailParser.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully updated parsers.',
        mailParser: updatedMailParser.map((parser) => ({
          parseKey: parser.parseKey,
          parseRegex: parser.parseRegex,
          format: parser.format,
          required: parser.required,
        })),
      }),
    };
  }

  const newChannelMailParser = new ChannelMailParser({
    channelId,
    type,
    mailParser,
  });

  await newChannelMailParser.save();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Successfully updated parsers.',
      mailParser: mailParser.map((parser) => ({
        parseKey: parser.parseKey,
        parseRegex: parser.parseRegex,
        format: parser.format,
        required: parser.required,
      })),
    }),
  };
};

export const addOrUpdateParsers = middyfy(addOrUpdateParsersHandler);
