require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express() //在实例化express的后面开始编写测试数据的相关策略
var apiRoutes = express.Router();

// var appData = require('../data.json');

var hangzhouTrack = require('../src/mock/data/hangzhouTrack.json'); // 引入测试数据
apiRoutes.get('/hangzhouTrack', function (req, res) {
  res.json({
    errno: 0,
    data: hangzhouTrack
  });
});

var chartColume = require('../src/mock/data/chartColume.json'); // 引入测试数据
apiRoutes.get('/chartColume', function (req, res) {
  res.json({
    errno: 0,
    data: chartColume
  });
});

var energyTypeMonth = require('../src/mock/data/energyTypeMonth.json'); // 引入测试数据
apiRoutes.get('/energyTypeMonth', function (req, res) {
  res.json({
    errno: 0,
    data: energyTypeMonth
  });
});

var energyTypeQuater = require('../src/mock/data/energyTypeQuater.json'); // 引入测试数据
apiRoutes.get('/energyTypeQuater', function (req, res) {
  res.json({
    errno: 0,
    data: energyTypeQuater
  });
});
var energyTypeYear = require('../src/mock/data/energyTypeYear.json'); // 引入测试数据
apiRoutes.get('/energyTypeYear', function (req, res) {
  res.json({
    errno: 0,
    data: energyTypeYear
  });
});


app.use('/api', apiRoutes);


var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

/*app.use('/test',express.static('./test'));*/

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
