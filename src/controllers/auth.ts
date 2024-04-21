import {Context} from "hono";
import {decrypt, encrypt, getAccessToken, getJsApiSignature, getJsapiTicket, getSignature} from "../utils/wecom_crypto";
import {getAccessTokenApi} from "../api/auth";
import {sendTextMessageApi} from "../api/message";
import {XMLParser} from 'fast-xml-parser'
import {getXMLObject} from "../models/proactive_messaging";
import {createResponseXml, TextMessage} from "../models/passive_messages";

/** 企业微信消息验证回调
 * @url /callback
 * @method GET
 * */
export async function callbackValidation(c: Context): Promise<Response> {
    const token = "zvc9n1WcCL2p0A2jzFdzS"
    const encodingAESKey = "FMox2C8OsO0yfD8jzz6fRElAb6r6hm9BRJfUqxjnCUe"

    const msg_signature = c.req.query("msg_signature")!
    const timestamp = c.req.query("timestamp")!
    const nonce = c.req.query("nonce")!
    const echostr = c.req.query("echostr")!

    const signStr = await getSignature(token, timestamp, nonce, echostr)
    if (signStr === msg_signature) {
        const plainText = decrypt(encodingAESKey, echostr)
        return c.text(plainText.message)
    } else {
        await sendTextMessageApi(`签名错误`, "1000002")
        return c.text("签名错误")
    }
}

/** 企业微信消息回调
 * @url /callbackMessage
 * @method POST
 * */
export async function callbackMessage(c: Context): Promise<Response> {
    const token = "zvc9n1WcCL2p0A2jzFdzS"
    const encodingAESKey = "FMox2C8OsO0yfD8jzz6fRElAb6r6hm9BRJfUqxjnCUe"
    const corpid = "wwb330a036235c91ea"

    const msg_signature = c.req.query("msg_signature")!
    const timestamp = c.req.query("timestamp")!
    const nonce = c.req.query("nonce")!

    const parser = new XMLParser();
    const obj = parser.parse(await c.req.raw.text()) as EncryptedMessage;
    const Encrypt = obj.xml.Encrypt
    // 获取发过来的应用ToUserName
    const fromUserName = obj.xml.ToUserName
    // 获取发过来的应用AgentID
    const fromAgentID = obj.xml.AgentID

    // 校验签名
    const signStr = await getSignature(token, timestamp, nonce, Encrypt)
    if (signStr !== msg_signature) {
        return c.text("签名错误")
    }

    // 解码encrypt
    const plainText = decrypt(encodingAESKey, Encrypt)

    // await sendTextMessageApi(`收到消息: ${plainText.message}`,"1000002")
    const xml = getXMLObject(plainText.message)
    const xmlType = xml!.MsgType
    await sendTextMessageApi(`收到消息类型: ${xmlType}`,"1000002")

    return c.text("")
}
