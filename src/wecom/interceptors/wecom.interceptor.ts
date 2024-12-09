import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class WecomInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const wecomEnabled = this.configService.get<boolean>('wecom.enable');

    if (!wecomEnabled) {
      throw new HttpException('未启用wecom', HttpStatus.FORBIDDEN);
    }
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle();
  }
}
