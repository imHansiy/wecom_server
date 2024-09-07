import { HttpService } from '@nestjs/axios';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decrypt, encrypt, getSignature } from '@wecom/crypto';
import { firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { WecomMessage } from './wecom.message';

@Injectable()
export class WecomService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly wecomMessage: WecomMessage,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    //获取access_token
    async getAccessToken() {
        const cacheKey = 'wecom_access_token';

        // 先尝试从缓存中获取 access_token
        let accessToken = await this.cacheManager.get<string>(cacheKey);
        if (accessToken) {
            return accessToken;
        }

        const corpid = this.configService.get<string>("wecom.corpid")
        const corpsecret = this.configService.get<string>("wecom.corpsecret")
        let data = await firstValueFrom(this.httpService.get<WecomAccessToken>(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`))
        const { access_token, expires_in } = data.data;
        await this.cacheManager.set(cacheKey, access_token, expires_in - 200); // 提前 200 秒更新，以防过期
        return access_token
    }

    getJsApiSignature(): string {
        return "";
    };

    // 验证URL有效性
    validateUrl(callbackVerificationParams: CallbackVerificationParams, token: string, encodingAESKey: string): string {
        const { timestamp, nonce, echostr, msg_signature } = callbackVerificationParams;
        const signStr = getSignature(token, timestamp, nonce, echostr);
        if (signStr !== msg_signature) {
            return "签名错误";
        }
        return decrypt(encodingAESKey, echostr).message;
    }

    // 处理文本消息
    async handleTextMsg(msg: PlaintextTextMessage, toUserName: string, fromUserName: string): Promise<string> {
        let count = 1000;
        let str = Array.from({ length: count }, (v, i) => `测试${i + 1}`).join('');
        await this.wecomMessage.sendTextMsg(str,toUserName);
        return "文本消息"
    }

    // 处理图片消息
    handleImageMsg(msg: PlaintextImageMessage): string {
        return msg.xml.PicUrl._cdata
    }
    // 处理语言消息
    handleVoiceMsg(msg: PlaintextVoiceMessage): string {
        return msg.xml.MediaId._text
    }
    // 处理视频消息
    handleVideoMsg(msg: PlaintextVideoMessage): string {
        return msg.xml.MediaId._text
    }
    // 处理位置消息
    handleLocationMsg(msg: PlaintextLocationMessage): string {
        return msg.xml.Location_X._text + " " + msg.xml.Location_Y._text
    }
    // 处理链接消息
    handleLinkMsg(msg: PlaintextLinkMessage): string {
        return msg.xml.Url._cdata
    }
}
