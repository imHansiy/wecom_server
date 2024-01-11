import {Context} from "hono";

export function callback(c: Context) : Response {
    return c.text("aaa")
}