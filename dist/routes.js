'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controllers = require('./controllers');

var routes = function routes(server) {
  server.get('/', _controllers.homeControllers.main);

  server.post('/users', _controllers.userControllers.create);

  server.get('/users/:mobileNumber', _controllers.userControllers.single);

  server.get('/journeytimes/', _controllers.journeyTimeControllers.calculate);

  server.post('/journeys', _controllers.journeyControllers.create);

  server.get('/journeys/:mobileNumber', _controllers.journeyControllers.find);

  server.post('/receivemessage/', _controllers.messageControllers.receive);
};

exports.default = routes;