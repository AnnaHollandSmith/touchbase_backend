'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controllers = require('./controllers');

var _receiveMessage = require('./controllers/receiveMessage');

var _receiveMessage2 = _interopRequireDefault(_receiveMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = function routes(server) {
  server.get('/', _controllers.homeControllers.main);

  server.post('/users', _controllers.userControllers.create);

  server.get('/users/:mobileNumber', _controllers.userControllers.single);

  server.get('/journeytimes/', _controllers.journeyTimeControllers.calculate);

  server.post('/journeys', _controllers.journeyControllers.create);
  server.post('/journeys/terminate', _controllers.journeyControllers.terminate);
  server.post('/journeys/extend', _controllers.journeyControllers.extend);

  server.get('/journeys/:mobileNumber', _controllers.journeyControllers.find);

  server.post('/receivemessage/', _controllers.messageControllers.receive);

  server.post('/999', _receiveMessage2.default);
};

exports.default = routes;