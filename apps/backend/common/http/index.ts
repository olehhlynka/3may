import { HttpStatusCodes } from '@swarmion/serverless-contracts';

export function httpResponse<T>(data: T, statusCode = 200) {
  return {
    body: data,
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
    },
  };
}

export function httpError(error: Error) {
  const responseBody = {
    error: error.message,
  };

  return {
    body: JSON.stringify(responseBody),
    statusCode: HttpStatusCodes.BAD_GATEWAY,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
    },
  };
}
