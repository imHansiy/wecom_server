import { Context } from "hono";
import { createDatabase } from "../database";

export function test(c: Context) {
    const database = createDatabase();
    const data = database.saveSapiTicket("ss");
    return c.text("test")
}