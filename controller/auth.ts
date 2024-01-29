import {Request, Response} from "express";
import request from "../config/axios_config";
import config from "config";

/**
 * 获得token
 * @url /cgi-bin/gettoken
 * @param corpid 企业ID
 * @param corpsecret 应用的凭证密钥
 */
export async function getToken(req: Request, res: Response) {
    try {
        const corpid =  process.env.WECOM_CORPID || config.get<string>("wecom.corpid")
        const corpsecret = process.env.WECOM_CORPSECRET || config.get<string>("wecom.corpsecret")
        const {data} = await request({
            url: `/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`,
            method: "GET",
        });
        return res.send(data);
    } catch (error) {
        // 处理错误，可以打印日志或返回适当的错误响应
        console.error("获取token失败", error);
        return res.status(500).send(error);
    }
}

export function callback(req: Request, res: Response){
    return res.send("sd");
}