import { Hono } from 'hono'
import {routers} from "./routers";

const app = new Hono()
routers(app)
export default app