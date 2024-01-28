import {Hono} from "hono";
import {callback, getToken} from "../controllers/auth";

export function routers(Hono: Hono) {
    Hono.get('/getToken', (c) => getToken(c))
    Hono.get('/', (c) => c.text("sss"))
    Hono.route('/callback').all(c => callback(c))
}