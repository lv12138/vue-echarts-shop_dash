
// seller 商家销量
// budget 预算开销
// stock 库存信息
// trend 销量趋势
// rank 销量排行
// map 商家分布
// hotproduct 热销商品

// 处理业务逻辑的中间件
const path = require('path')
const fileUtils = require('../utils/file_utils')
module.exports = async (ctx, next) => {
    ctx.response.body = '业务逻辑中间件'
    let filePath = ctx.request.url.replace('/api', '')
    filePath = path.join(__dirname, '../data' + filePath + '.json')
    try {
        const jsonData = await fileUtils.getFileJsonData(filePath)
        ctx.response.body = jsonData
    } catch (e) {
        const errorMsg = {
            message: '请求的地址不存在！',
            status: 'err',
            code: 404
        }
        ctx.response.body = JSON.stringify(errorMsg)
    }
    await next()
}
