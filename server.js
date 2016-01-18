var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(function(req, res, next) {
  console.log(req.path);
  next();
});

app.use(bodyParser.json({ limit: '50mb' }));

app.use('/', express.static(path.join(__dirname, '/build')));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/index.html'));
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port', port);
