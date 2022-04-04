// 计算服务器消耗时长的中间件

// 记录开始时间
// 让内层中间件得到执行
// 记录结束时间
// 设置响应头 X-Respose-time
module.exports = async (ctx, next) => {
    // 记录开始时间
    const startTime = Date.now()
    // 让内层中间件得到执行
    await next()
    // 记录结束时间
    const endTime = Date.now()
    // 计算耗时
    const duration = endTime - startTime
    // 设置响应头
    ctx.set('X-Response-Time', duration + 'ms')
}
