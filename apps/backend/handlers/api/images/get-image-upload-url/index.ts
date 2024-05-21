import cors from '@middy/http-cors';
import middy from '@middy/core';
import { UserType, getImageUploadUrlContract } from '@3may/contracts';
import { HttpStatusCodes, getHandler } from '@swarmion/serverless-contracts';
import { httpResponse } from '@/common/http';
import { ajv } from '@/common/ajv';
import { errorHandlingMiddleware } from '@/middlewares/error-handling-middleware';
import {
  DbConnectionContext,
  dbConnection,
} from '@/middlewares/database-connection-middleware';
import { USERS_COLLECTION } from '@/common/constants/database-constants';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import { v4 as uuidv4 } from 'uuid';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const { IMAGES_BUCKET_NAME } = process.env;
const SUPPORTED_EXTENSIONS = /\.jpg|\.png|\.jpeg/;

const client = new S3Client();

const main = getHandler(getImageUploadUrlContract, {
  ajv,
  validateOutput: false,
})(async (event, context) => {
  const { db } = context as DbConnectionContext;
  const { fileName } = event.pathParameters;
  const { sub: cognitoId } = event.requestContext.authorizer.jwt.claims;

  const user = await db
    .collection<UserType>(USERS_COLLECTION)
    .findOne({ cognitoId });

  if (!user) {
    throw new Error('User not found', { cause: HttpStatusCodes.FORBIDDEN });
  }

  const extension = fileName.toLowerCase().match(SUPPORTED_EXTENSIONS)?.[0];

  if (!extension) {
    throw new Error('Unsupported file extension', {
      cause: HttpStatusCodes.BAD_REQUEST,
    });
  }

  const key = `${user._id}/${uuidv4()}${extension}`;
  const imageUrl = `https://${IMAGES_BUCKET_NAME}.s3.amazonaws.com/${key}`;

  const presignedPost = await createPresignedPost(client, {
    Bucket: IMAGES_BUCKET_NAME!,
    Key: key,
    Conditions: [
      { bucket: IMAGES_BUCKET_NAME! },
      ['content-length-range', 1024, 5242880],
      ['starts-with', '$Content-Type', 'image/'],
    ],
    Fields: { key },
    Expires: 300,
  });

  return httpResponse({ url: imageUrl, presignedPost });
});

export const handler = middy(main)
  .use(doNotWaitForEmptyEventLoop())
  .use(cors())
  .use(dbConnection())
  .use(errorHandlingMiddleware());
