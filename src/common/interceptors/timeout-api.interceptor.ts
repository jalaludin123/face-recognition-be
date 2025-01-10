import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';

const SetTimeout = (timeout: number) => SetMetadata('request-timeout', timeout);

export function SetRequestTimeout(timeout: number = 60000) {
  return applyDecorators(
    SetTimeout(timeout),
    UseInterceptors(TimeoutInterceptor)
  );
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const timeout =
      this.reflector.get<number>('request-timeout', context.getHandler()) ||
      300000;
    response.setTimeout(timeout);

    return next.handle();
  }
}
