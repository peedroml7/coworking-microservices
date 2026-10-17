import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

interface RpcError {
  statusCode: number;
  message: string;
}

const isRpcError = (error: unknown): error is RpcError =>
  typeof error === 'object' &&
  error !== null &&
  typeof (error as RpcError).statusCode === 'number' &&
  typeof (error as RpcError).message === 'string';

@Catch()
export class RpcToHttpFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (error instanceof HttpException) {
      return response.status(error.getStatus()).json(error.getResponse());
    }

    if (isRpcError(error)) {
      return response
        .status(error.statusCode)
        .json({ statusCode: error.statusCode, message: error.message });
    }

    response
      .status(500)
      .json({ statusCode: 500, message: 'Internal server error' });
  }
}
