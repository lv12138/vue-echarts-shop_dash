// 服务器的入口文件

// 1、创建对象
const Koa = require('koa')
const app = new Koa()

// 2、绑定中间件
// 计算耗时中间件
const durationMiddlewre = require('./src/middleware/koa_response_duration')
app.use(durationMiddlewre)

// 响应头中间件
const headerMiddleware = require('./src/middleware/koa_response_header')
app.use(headerMiddleware)

// 业务逻辑中间件
const dataMiddleware = require('./src/middleware/koa_response_data')
app.use(dataMiddleware)

// 3、绑定端口号
app.listen(8888)
