import {myFetch} from "../config/my_fetch";
import {getAccessTokenApi} from "./auth";

/**
 * 获得应用token
 * @url /cgi-bin/gettoken
 */
async function getAccessToken() {
    const corpid = "wwb330a036235c91ea"
    const corpsecret = "bpKk0puHo__K2WM2C4SDxZFRDOfxgFJnvW_vQy6HmhA"
    return getAccessTokenApi(corpid, corpsecret)
}

/** 发送文字消息
 * @url /cgi-bin/message/send
 * @param {string} content 文字内容不能超过2048字节
 * @param {string} agentid 企业应用的id，整型。可在应用的设置页面查看
 * @param {string} touser 用户ID列表（消息接收者，多个接收者用‘|’分隔.默认所有人）
 * @param {string} toparty 部门ID列表，多个接收者用‘|’分隔。当touser为@all时忽略本参数
 * @param {string} totag 标签ID列表，多个接收者用‘|’分隔。当touser为@all时忽略本参数
 * @param {string} safe 表示是否是保密消息，0表示否，1表示是，默认0
 * @param {string} enable_duplicate_check 表示是否开启重复消息检查，0表示否，1表示是，默认0
 * @param {string} duplicate_check_interval 表示是否重复消息检查的时间间隔，默认60s，最大不超过4小时
 * */
export async function sendTextMessageApi(content: string, agentid: string, touser: string = "@all", toparty: string = "", totag: string = "", safe: string = "0", enable_duplicate_check: string = "0", duplicate_check_interval: string = "60") {
    const access_token = await getAccessToken()
    const response = await myFetch(`/cgi-bin/message/send?access_token=${access_token}`, {
        method: "POST",
        body: JSON.stringify({
            touser,
            toparty,
            totag,
            msgtype: "text",
            agentid,
            text: {
                content
            },
            safe,
            enable_duplicate_check,
            duplicate_check_interval
        })
    })
    return response.json()
}

// 被动回复消息
