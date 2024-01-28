import {Context} from "hono";
import {token} from "../api/auth";

export function callback(c: Context) : Response {
    return c.text("aaa")
}

export function getToken(c:Context){
    return token(c,"wwb330a036235c91ea","bpKk0puHo__K2WM2C4SDxZFRDOfxgFJnvW_vQy6HmhA")
}