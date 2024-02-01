import {Context} from "hono";
import {decrypt, getSignature} from "../utils/wecom_crypto";
import {getAccessTokenApi} from "../api/auth";
import {sendTextMessageApi} from "../api/message";
import {XMLParser,XMLBuilder,XMLValidator} from 'fast-xml-parser'
/** 企业微信消息验证回调
 * @url /callback
 * @method GET
 * */
export async function callbackValidation(c: Context) : Promise<Response> {
    const token = "zvc9n1WcCL2p0A2jzFdzS"
    const encodingAESKey = "FMox2C8OsO0yfD8jzz6fRElAb6r6hm9BRJfUqxjnCUe"

    const msg_signature = c.req.query("msg_signature")!
    const timestamp = c.req.query("timestamp")!
    const nonce = c.req.query("nonce")!
    const echostr = c.req.query("echostr")!

    const signStr = await getSignature(token, timestamp, nonce, echostr)

    await sendTextMessageApi(`请求方式${c.req.raw.method}`,"1000002")

    if (signStr === msg_signature) {
        const plainText = await decrypt(encodingAESKey, echostr)
        await sendTextMessageApi(plainText.message,"1000002")
        return c.text(plainText.message)
    }else {
        await sendTextMessageApi(`
            签名错误:
            signStr:${signStr}
            msg_signature:${msg_signature}
            timestamp:${timestamp}
            nonce:${nonce}
            echostr:${echostr}
        `,"1000002")
        return c.text("签名错误")
    }
}

/** 企业微信消息回调
 * @url /callbackMessage
 * @method POST
 * */
export async function callbackMessage(c: Context) : Promise<Response> {
    const token = "zvc9n1WcCL2p0A2jzFdzS"
    const encodingAESKey = "FMox2C8OsO0yfD8jzz6fRElAb6r6hm9BRJfUqxjnCUe"

    const msg_signature = c.req.query("msg_signature")!
    const timestamp = c.req.query("timestamp")!
    const nonce = c.req.query("nonce")!

    const parser = new XMLParser();
    const obj = parser.parse(await c.req.raw.text()) as EncryptedMessage;
    const encrypt = obj.xml.Encrypt
    const toUserName = obj.xml.ToUserName
    const agentId = obj.xml.AgentID

    // 校验签名
    const signStr = await getSignature(token, timestamp, nonce, encrypt)
    if (signStr !== msg_signature) {
        console.error("签名错误")
        return c.text("签名错误")
    }

    // 解码encrypt
    const plainText = await decrypt(encodingAESKey, encrypt)
    

    await sendTextMessageApi(plainText.message,"1000002")

    return c.text(plainText.message)
}

/**
 * 获得应用token
 * @url /cgi-bin/gettoken
 */
export async function getAccessToken() {
    const corpid = "wwb330a036235c91ea"
    const corpsecret = "bpKk0puHo__K2WM2C4SDxZFRDOfxgFJnvW_vQy6HmhA"
    return getAccessTokenApi(corpid, corpsecret)
}