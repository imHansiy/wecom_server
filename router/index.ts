import { Express, Request, Response, Router } from 'express'
import {getToken} from "../controller/auth";

// 路由配置接口
interface RouterConf {
    path: string,
    router: Router,
}

// 路由配置
const routerConf: Array<RouterConf> = []

function routes(app: Express) {
    // 根目录
    app.get('/', (req: Request, res: Response) => getToken(req,res))

    routerConf.forEach((conf) => app.use(conf.path, conf.router))
}

export default routes