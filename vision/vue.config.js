const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8999 // 设置端口号
    // open: true // 自动打开浏览器
  },
  assetsDir: './static'
})
