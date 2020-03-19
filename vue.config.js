module.exports = {
  // 注释：这是配置了自动打开浏览器
  devServer: {
    open: true,
    port: 3000,
    // 配置代理
    // 只要请求的路径中, 包含 /aaa, 就会被代理
    // /aaa/login => http://localhost:8888/api/private/v1/aaa/login

    // 默认不配置, 路径重写, 会多一个 /aaa, 需要去掉 /aaa
    // /aaa/login => http://localhost:8888/api/private/v1/login
    proxy: {
      '/aaa': {
        target: 'http://localhost:8888/api/private/v1/',
        pathRewrite: { '^/aaa': '' }
      }
    }
  },
  // 配置webpack
  configureWebpack: {
    // 配置打包的排除项, 从外部引入
    // import Vue from 'vue'
    // import VueRouter from 'vue-router'
    // 当配置了排除项后, 导入时, 就直接找全局的 Vue, VueRouter
    externals: {
      // 包名: 全局变量名
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }
  }
}
