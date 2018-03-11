'use strict'
const utils = require('./utils')
const webpack = require('webpack')//核心编译工具
const config = require('../config')//配置文件 运行时和开发时所需要的配置的
const merge = require('webpack-merge')//合并配置文件
const baseWebpackConfig = require('./webpack.base.conf')//开发时候的配置文件和运行的的配置文件共享
const HtmlWebpackPlugin = require('html-webpack-plugin')//webpack提供操作html插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const axios = require('axios')
const portfinder = require('portfinder')

const express = require('express')
const app = express()//创建express应用程序

var appData = require('../data.json')//加载本地数据文件
var seller = appData.seller//获取对应的本地数据
var goods = appData.goods//获取对应的本地数据
var ratings = appData.ratings//获取对应的本地数据

var apiRoutes = express.Router() // 获取一个 express 的路由实例

apiRoutes.get('/seller', function (req,res) {
  res.json({
    errno:0,
    data:seller
  });
});
apiRoutes.get('/goods', function (req,res) {
  res.json({
    errno:0,
    data:goods
  });
});
apiRoutes.get('/ratings', function (req,res) {
  res.json({
    errno:0,
    datta:ratings
  });
});

app.use('/api',apiRoutes)

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },//
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,//调试

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app) {
      app.get('/api/seller', function(req, res) {
        res.json({
          errno: 0,
          data: seller//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
        })
      });
      app.get('/api/goods', function(req, res) {
        res.json({
          errno: 0,
          data: goods
        })
      });
      app.get('/api/ratings', function(req, res) {
        res.json({
          errno: 0,
          data: ratings
        })
      });
    },
    inline:true,
    port: 8080,
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')//将源码中的process.env替换为../config/dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),//热加载插件
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({//通过filename指定编译后生成文件名 最终输出的文件与打包之前的文件同名
      filename: 'index.html',
      template: 'index.html',//指定处理的模板
      inject: true//打包后的文件添加到到HTML里面 比如HTML--body css- header里面
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))
      resolve(devWebpackConfig)
    }
  })
})
