import {Hono} from "hono";
import {callbackMessage, callbackValidation} from "../controllers/auth";
import {sendTextMessage} from "../controllers/message";

export function routers(Hono: Hono) {
    // 全局中间件
    Hono.use('*', async (c, next) => {
        await next()
        if (c.error){
            c.html(`
            <h1>错误</h1>
            <p>${c.error.message}</p>
            `)
        }
    })
    Hono.notFound((c) => c.json({ message: '啊哦,没有这个页面', ok: false }, 404))

    Hono.all('/', (c) => c.text("企业微信应用开发框架"))

    // 消息验证回调
    Hono.get('/callback',c => callbackValidation(c))
    // 接收消息
    Hono.post('/callback', c => callbackMessage(c))

    // 发送文本消息
    Hono.post("/sendTextMessage", c => sendTextMessage(c))
}