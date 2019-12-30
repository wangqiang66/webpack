'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const ip = require('quick-local-ip').getLocalIP4();
const devEnv = {
  '/tools': {
    target: 'http://10.11.0.175:9096',
    changeOrigin: true
  },
  '/core': {
    target: 'http://10.11.0.175:9092',
    changeOrigin: true
  },
  '/business': {
    target: 'http://10.11.0.144:9920',
    changeOrigin: true
  }
}

const zbEnv = {
  '/tools': {
    target: 'http://10.96.2.220:9096',
    changeOrigin: true
  },
  '/core': {
    target: 'http://10.96.2.220:9092',
    changeOrigin: true
  },
  '/business': {
    target: 'http://10.96.2.220:9920',
    changeOrigin: true
  },
  '/base': {
    target: 'http://10.96.2.220:9900',
    changeOrigin: true
  }
}

const sitEnv = {
  '/tools': {
    target: 'http://119.23.69.49',
    changeOrigin: true
  },
  '/core': {
    target: 'http://119.23.69.49',
    changeOrigin: true
  },
  '/business': {
    target: 'http://119.23.69.49',
    changeOrigin: true
  }
}

const uatEnv = {
  '/tools': {
    target: 'https://wechatmini.ddjf.com',
    changeOrigin: true
  },
  '/core': {
    target: 'https://wechatmini.ddjf.com',
    changeOrigin: true
  },
  '/business': {
    target: 'https://wechatmini.ddjf.com',
    changeOrigin: true
  }
}

const mockEnv = {
  '/business': {
    target: 'http://10.1.108.96:2222/mock/5caeeffe1375a35bf1bdc036/intention',
    changeOrigin: true
  },
  '/tools': {
    target: 'http://10.1.108.96:2222/mock/5caeeffe1375a35bf1bdc036/intention',
    changeOrigin: true
  },
  '/core': {
    target: 'http://10.1.108.96:2222/mock/5caeeffe1375a35bf1bdc036/intention',
    changeOrigin: true
  }
}

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    env: require('./dev.env'),
    // webpack-dev-server 相关配置
    proxyTable: sitEnv,
    // Various Dev Server settings
    host: ip || 'localhost', // can be overwritten by process.env.HOST
    port: 8083, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: '#cheap-module-eval-source-map',
    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../intention/dest/index.html'),
    env: require('./prod.env'),
    // Paths
    assetsRoot: path.resolve(__dirname, '../intention/dest'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    /**
     * Source Maps
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
