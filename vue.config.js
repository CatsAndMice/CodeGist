const { defineConfig } = require('@vue/cli-service')
const { ArcoResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:'',
  configureWebpack: {
    plugins: [
      require('unplugin-auto-import/webpack').default({ resolvers: [ArcoResolver()] }),
      require('unplugin-vue-components/webpack').default({ resolvers: [ArcoResolver()] }),
    ]
  }
})
