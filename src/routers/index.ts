import {Hono} from "hono";
import {callback} from "../controllers/auth";

export function routers(Hono: Hono) {
    Hono.get('/hello', (c) => c.text('Hello, world!'))
    Hono.get('/', (c) => c.text("sss"))
    Hono.route('/callback').all(c => callback(c))
}