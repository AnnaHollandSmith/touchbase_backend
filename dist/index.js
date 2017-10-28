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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

(0, _routes2.default)(server);

server.listen(port, function () {
  console.log('Server is listening on port ' + port);
});