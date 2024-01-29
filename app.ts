import express from 'express'
import routes from './router' // 路由
import config from 'config'
const app = express()

// 解析json
app.use(express.json())

const PORT = config.get<number>("port")

// 启动
app.listen(PORT, async () => {
    console.log(`App is running at http://localhost:${PORT}`)
    routes(app)
})
