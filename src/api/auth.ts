import { Context } from "hono";
import { env } from 'hono/adapter'
/**
 * 获得token
 * @url /cgi-bin/gettoken
 * @param corpid 企业ID
 * @param corpsecret 应用的凭证密钥
 */
export async function token(c: Context, corpid: string, corpsecret: string) {
    try {
        const response = await fetch(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`)
        return c.json(await response.json())
    } catch (error) {
        // 处理错误，可以打印日志或返回适当的错误响应
        console.error("获取token失败", error);
        return c.json({error: "获取token失败"});
    }
}