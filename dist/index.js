'use strict';

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

_dotenv2.default.config({
  path: _path2.default.join(__dirname, '../.env')
});

_mongoose2.default.connect(process.env.DATABASE_URL, {
  useMongoClient: true
});

var server = _restify2.default.createServer();
var port = process.env.PORT || 3000;

server.use(_restify2.default.bodyParser());
server.use(_restify2.default.queryParser());
server.use(function crossOrigin(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  return next();
});

(0, _routes2.default)(server);
(0, _config.cron)();

server.listen(port, function () {
  console.log('Server is listening on port ' + port);
});