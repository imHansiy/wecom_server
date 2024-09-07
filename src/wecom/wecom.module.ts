import { Module, forwardRef } from '@nestjs/common';
import { WecomController } from './wecom.controller';
import { WecomService } from './wecom.service';
import { WecomInterceptor } from './interceptors/wecom.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { WecomMessage } from './wecom.message';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => WecomModule)
  ],
  controllers: [WecomController],
  providers: [WecomService, WecomMessage, {
    provide: APP_INTERCEPTOR,
    useClass: WecomInterceptor,
  }],
  exports: [WecomService, WecomMessage],
})
export class WecomModule { }
