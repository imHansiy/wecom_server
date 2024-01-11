import {
    getSignature,
    getJsApiSignature,
    decrypt
} from "@wecom/crypto";
import {Context} from "hono";

export function callback(c: Context) : Response {
    // @ts-ignore
    const {echostr,msg_signature,nonce,timestamp} = req.query
    const signStr = getSignature("X2OrSGdR7CznZ56NNmmlIDGrQ",timestamp,nonce,echostr)
    if(signStr !== msg_signature){
        return c.text("error")
    }

    const plainText = decrypt("WrxU2aBRQdmsHhVwlHk4byVIECFtEbWjnKfQalQBOzp",echostr)
    return c.text("aaa")
}