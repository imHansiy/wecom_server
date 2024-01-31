import {myFetch} from "../config/my_fetch";

/** 获得账户token
 * @url /cgi-bin/gettoken
 * @param {string} corpid 企业ID
 * @param {string} corpsecret 应用的凭证密钥
 * @return {string} access_token 账户token
* */
export async function getAccessTokenApi(corpid: string, corpsecret: string) {
    const response = await myFetch(`/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`)
    const access_token = await response.json() as AccessTokenResponse
    return access_token.access_token
}