import { Module } from '@nestjs/common';
import { WecomController } from './wecom.controller';
import { WecomService } from './wecom.service';
import { WecomInterceptor } from './interceptors/wecom.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [WecomController],
  providers: [WecomService, {
    provide: APP_INTERCEPTOR,
    useClass: WecomInterceptor,
  }]
})
export class WecomModule { }
