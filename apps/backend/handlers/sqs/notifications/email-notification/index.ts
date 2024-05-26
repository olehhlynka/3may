import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import { Context } from 'aws-lambda';

import { SES } from '@aws-sdk/client-ses';
import eventNormalizer from '@middy/event-normalizer';

const ses = new SES();

interface SQSMessageAttributes {
  [name: string]: {
    stringValue?: string;
    binaryValue?: string;
    stringListValues: string[];
    binaryListValues: string[];
    dataType: string;
  };
}

interface SQSRecord {
  messageId: string;
  receiptHandle: string;
  body: {
    email: string;
    title: string;
    text: string;
  };
  attributes: {
    ApproximateReceiveCount: string;
    SentTimestamp: string;
    SenderId: string;
    ApproximateFirstReceiveTimestamp: string;
  };
  messageAttributes: SQSMessageAttributes;
  md5OfBody: string;
  eventSource: string;
  eventSourceARN: string;
  awsRegion: string;
}

interface SQSEvent {
  Records: SQSRecord[];
}

type SQSHandler = (event: SQSEvent, context: Context) => Promise<void>;

const main: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const { email, title, text } = record.body;

    const sesEmailProps = {
      Source: process.env.SES_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: text,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: title,
        },
      },
    };

    await ses.sendEmail(sesEmailProps);
  }
};

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(eventNormalizer())
  .use(errorHandlingMiddleware());
