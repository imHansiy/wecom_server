import {Context} from "hono";
import {decrypt, getSignature} from "../utils/wecom_crypto";
import {getAccessTokenApi} from "../api/auth";
import {sendTextMessageApi} from "../api/message";
import {XMLParser,XMLBuilder } from 'fast-xml-parser'
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

    if (signStr === msg_signature) {
        const plainText = await decrypt(encodingAESKey, echostr)
        return c.text(plainText.message)
    }else {
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
    const xml = parser.parse(plainText.message)
    const xmlType = xml.xml.MsgType


    // 更具消息类型进行不同的处理
    switch (xmlType) {
        case "text":
            const textMessage = xml as TextMessage
            return c.text(textMessage.xml.Content)
        case "image":
            const imageMessage = xml as ImageMessage
            return c.text(imageMessage.xml.PicUrl)
        case "voice":
            const voiceMessage = xml as VoiceMessage
            return c.text(voiceMessage.xml.MediaId)
        case "video":
            const videoMessage = xml as VideoMessage
            return c.text(videoMessage.xml.MediaId)
        case "location":
            const locationMessage = xml as LocationMessage
            return c.text(locationMessage.xml.Label)
        case "link":
            const linkMessage = xml as LinkMessage
            return c.text(linkMessage.xml.Title)
        default:
            return c.text("未知的消息类型")
    }
    const builder = new XMLBuilder();
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