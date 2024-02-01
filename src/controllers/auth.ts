import {Context} from "hono";
import {decrypt, getSignature} from "../utils/wecom_crypto";
import {getAccessTokenApi} from "../api/auth";
import {sendTextMessageApi} from "../api/message";

/** 企业微信验证回调
 * @url /callback
 * */
export async function callback(c: Context) : Promise<Response> {
    const token = "zvc9n1WcCL2p0A2jzFdzS"
    const encodingAESKey = "FMox2C8OsO0yfD8jzz6fRElAb6r6hm9BRJfUqxjnCUe"

    const msg_signature = c.req.query("msg_signature")!
    const timestamp = c.req.query("timestamp")!
    const nonce = c.req.query("nonce")!
    const echostr = c.req.query("echostr")!

    sendTextMessageApi("测试","1000002")

    const signStr = await getSignature(token, timestamp, nonce, echostr)
    if (signStr === msg_signature) {
        const plainText = await decrypt(encodingAESKey, echostr)
        return c.text(plainText.message)
    }else {
        return c.text("签名错误")
    }
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