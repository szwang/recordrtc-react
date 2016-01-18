var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');

var app = express();

var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use(function(req, res, next) {
  console.log(req.path);
  next();
});

app.use(bodyParser.json({ limit: '50mb' }));

app.post('/upload', function(req, res) {
  var files = req.body;
  
  if(!files.video) {
    utils.uploadToDisk(files.audio, true)
    .then(function(success) {
      res.send(success);
    })
  } else {
    utils.uploadToDisk(files.audio, false)
    .then(function() { utils.uploadToDisk(files.video, false) })
    .then(function() { return utils.merge(files) })
    .then(function(success) {
      res.send(success);
    })
  }
})

app.use('/', express.static(path.join(__dirname, '/build')));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/index.html'));
});

var port = process.env.PORT || 8880;
app.listen(port);
console.log('Listening on port', port);
