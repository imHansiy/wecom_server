import {Context} from "hono";
import {my_fetch} from "../config/my_fetch";
import {decrypt, getSignature} from "../utils/wecom_crypto";

/** 企业微信验证回调
 * @url /callback
 * */
export async function callback(c: Context) : Promise<Response> {
    const msg_signature = c.req.query("msg_signature")!
    const timestamp = c.req.query("timestamp")!
    const nonce = c.req.query("nonce")!
    const echostr = c.req.query("echostr")!

    const signStr = await getSignature("ymDeEMb8KoHQuLG8TYbtl", timestamp, nonce, echostr)
    if (signStr === msg_signature) {
        const plainText = await decrypt("lLIyPq0DXmYioJeFHJvKcdpSgfwUAGYb2CwUettUL2j", echostr)
        return c.text(plainText.message)
    }else {
        return c.text("签名错误")
    }
}

/**
 * 获得应用token
 * @url /cgi-bin/gettoken
 */
export async function getToken(c: Context) {
    const corpid = "wwb330a036235c91ea"
    const corpsecret = "bpKk0puHo__K2WM2C4SDxZFRDOfxgFJnvW_vQy6HmhA"
    try {
        const response = await my_fetch(`/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`)
        return c.json(await response.json())
    } catch (error) {
        // 处理错误，可以打印日志或返回适当的错误响应
        console.error("获取token失败", error);
        return c.json({error: "获取token失败"});
    }
}