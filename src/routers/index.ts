import {Hono} from "hono";
import {callback, getAccessToken} from "../controllers/auth";
import {sendTextMessage} from "../controllers/message";

export function routers(Hono: Hono) {
    Hono.all('/', (c) => c.text("企业微信应用开发框架"))
    Hono.route('/callback').all(c => callback(c))
    // 发送文本消息
    Hono.post("/sendTextMessage", c => sendTextMessage(c))
}