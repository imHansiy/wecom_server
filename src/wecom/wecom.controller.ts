import { Body, Controller, Get, Header, Inject, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { decrypt, encrypt, getSignature } from '@wecom/crypto';
import * as crypto from 'crypto';
import { xml2js } from 'xml-js';
import { WecomService } from './wecom.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { create } from 'xmlbuilder2';
@ApiTags('企业微信-服务器回调校验')
@Controller('wecom')
export class WecomController {
    constructor(
        private readonly wecomService: WecomService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }
    @Get()
    @ApiOperation({ summary: '微信服务器验证接口' })
    callbackValidation(@Query() query: CallbackVerificationParams): string {
        const token = this.configService.get<string>("wecom.token")
        const encodingAESKey = this.configService.get<string>("wecom.encodingAESKey")
        return this.wecomService.validateUrl(query, token, encodingAESKey);
    }

    @Post()
    @ApiOperation({ summary: '接收消息' })
    async callbackMessage(@Body() body: ReceiveMessage, @Query() query: CallbackVerificationParams): Promise<string> {

        const encodingAESKey = this.configService.get<string>("wecom.encodingAESKey")
        const plainText = decrypt(encodingAESKey, body.xml.Encrypt).message
        const parsedMessage = xml2js(plainText, { compact: true }) as PlaintextMessage

        const messageType = parsedMessage.xml.MsgType._cdata
        switch (messageType) {
            case "text":
                // 这里不能使用异步，不然没办法即时回复企业微信后端，导致重复请求
                this.wecomService.handleTextMsg(parsedMessage as PlaintextTextMessage, parsedMessage.xml.FromUserName._cdata, parsedMessage.xml.ToUserName._cdata)
                break;
            case "image":
                this.wecomService.handleImageMsg(parsedMessage as PlaintextImageMessage, parsedMessage.xml.FromUserName._cdata, parsedMessage.xml.ToUserName._cdata)
                break;
            case "voice":
                this.wecomService.handleVoiceMsg(parsedMessage as PlaintextVoiceMessage, parsedMessage.xml.FromUserName._cdata, parsedMessage.xml.ToUserName._cdata)
                break;
            case "video":
                this.wecomService.handleVideoMsg(parsedMessage as PlaintextVideoMessage, parsedMessage.xml.FromUserName._cdata, parsedMessage.xml.ToUserName._cdata)
                break;
            case "location":
                this.wecomService.handleLocationMsg(parsedMessage as PlaintextLocationMessage, parsedMessage.xml.FromUserName._cdata, parsedMessage.xml.ToUserName._cdata)
                break;
            case "link":
                this.wecomService.handleLinkMsg(parsedMessage as PlaintextLinkMessage, parsedMessage.xml.FromUserName._cdata, parsedMessage.xml.ToUserName._cdata)
                break;
            case "event":
                break;
            default:
                "未知的消息类型"
                console.log("未知的消息类型:", messageType);
                break;
        }
        return "sucess";
    }
}
