import { Hono } from 'hono'
import {H} from "hono/dist/types/types";
import {routers} from "./routers";

const app = new Hono()
routers(app)
export default app