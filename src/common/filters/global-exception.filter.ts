import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    if (
      exception.status !== HttpStatus.UNAUTHORIZED &&
      exception.status !== HttpStatus.FORBIDDEN &&
      exception.status !== HttpStatus.BAD_REQUEST
    ) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
      const status = HttpStatus.INTERNAL_SERVER_ERROR;

      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );

      response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
      });
    }
  }
}
