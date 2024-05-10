import { httpError } from '@/common/http';
import middy, { Request } from '@middy/core';
import { Context } from 'aws-lambda';

const errorHandlingMiddleware = (): middy.MiddlewareObj => {
  return {
    onError: (request: Request<unknown, unknown, Error, Context>) => {
      if (request.error) {
        console.error('Error', request.error);

        return httpError(request.error);
      }

      return httpError(new Error('Internal server error'));
    },
  };
};

export { errorHandlingMiddleware };
