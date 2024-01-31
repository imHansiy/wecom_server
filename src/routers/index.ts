import {Hono} from "hono";
import {callback, getToken} from "../controllers/auth";

export function routers(Hono: Hono) {
    Hono.all('/', (c) => c.text("企业微信应用开发框架"))
    Hono.get('/getToken', (c) => getToken(c))
    Hono.route('/callback').all(c => callback(c))
}