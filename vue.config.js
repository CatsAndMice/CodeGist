const { defineConfig } = require('@vue/cli-service')
const { ArcoResolver } = require('unplugin-vue-components/resolvers')
process.env.VUE_APP_VERSION = 'qw'
process.env.APP_SYSTEMNAME = '1212'
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  //生产环境取消生成map文件
  productionSourceMap: false,
  outputDir: 'dist/source',

  configureWebpack: {
    plugins: [
      require('unplugin-auto-import/webpack').default({ resolvers: [ArcoResolver()] }),
      require('unplugin-vue-components/webpack').default({ resolvers: [ArcoResolver()] }),
    ]
  }
})
