/**
 * function: webpack.config.js
 * author  : wq
 * update  : 2019/12/31 14:35
 */

// const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {}
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        {
          loader: 'css-loader',
          options: {
            url: true
          }
        }
      ]
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
    }]
  },
  // plugins: [
  //   new VueLoaderPlugin()
  // ]
}
