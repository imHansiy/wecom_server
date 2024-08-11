import { Injectable } from '@nestjs/common';
import { CallbackVerificationParams } from './dto/wecom/auth';
import { decrypt, getSignature } from '@wecom/crypto';

@Injectable()
export class AuthService {
    // 验证URL有效性
    validateUrl(callbackVerificationParams:CallbackVerificationParams,token:string,encodingAESKey:string):string{
        const {timestamp,nonce,echostr,msg_signature} = callbackVerificationParams;
        const signStr =  getSignature(token,timestamp,nonce,echostr);
        if(signStr !== msg_signature){
            return "签名错误";
        }
        return decrypt(encodingAESKey,echostr).message;
    }
}
