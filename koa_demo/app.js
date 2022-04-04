// 1、创建koa对象
// 2、编写响应函数（中间件）
// 3、绑定端口号（3000）

// 1、创建koa对象
const koa = require('koa')
const app = new koa()
// 2、编写响应函数（中间件）
// 第一层中间件
app.use( async (ctx, next) => {
    // ctx：上下文（web容器），ctx.request, ctx.response
    // next：下一层中间件，下一层中间件有没有得到执行，取决于next这个函数有没有被调用
    // console.log(ctx.request.url)
    ctx.response.body = 'Hello World'
    console.log('第一层中间件')
    const ret = await next()
    console.log(ret)
    console.log('第一层中间件.......')
})
// 第二层中间件
app.use(async (ctx, next) => {
    console.log('第二层中间件')
    const ret = await next()
    console.log(ret)
    console.log('第二层中间件.......')
    return '第二层中间件返回值'
})
// 第三层中间件
app.use((ctx, next) => {
    console.log('第三层中间件')
    return '第三层中间件返回值'
})
// 3、绑定端口号
app.listen(3000)
