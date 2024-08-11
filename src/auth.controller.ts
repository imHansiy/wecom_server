import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { CallbackVerificationParams } from './dto/wecom/auth';
@ApiTags('企业微信-服务器回调校验')
@Controller()
export class AuthController {
    constructor(
        private readonly authService:AuthService,
        private readonly configService:ConfigService
    ){}
    @Get()
    @ApiOperation({ summary: '微信服务器验证接口' })
    callbackValidation(@Query() query:CallbackVerificationParams):string{
        const token = this.configService.get<string>("wecom.token")
        const encodingAESKey = this.configService.get<string>("wecom.encodingAESKey")
        return this.authService.validateUrl(query,token,encodingAESKey);
    }

    @Post()
    @ApiOperation({ summary: '接收消息' })
    callbackMessage(@Query() query:CallbackVerificationParams):string{
        return "success";
    }
}
