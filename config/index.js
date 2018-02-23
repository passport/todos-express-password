var BACKEND = 'http://c.qianka.com'
console.log(process.env.BACKEND)
module.exports = {
  dev: {
    env: 'dev',
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: { // 测试环境下 api 代理到 tigger
      '/v2/api': {
        target: BACKEND,
        changeOrigin: true,
        cookieDomainRewrite: {
          'http://127.0.0.1:3001': [BACKEND]
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}