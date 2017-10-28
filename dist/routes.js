'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _controllers = require('./controllers');

var routes = function routes(server) {
  server.get('/', _controllers.homeControllers.main);

  server.post('/users', _controllers.userControllers.create);

  server.get('/journeytimes/', _controllers.journeyTimeControllers.calculate);

  server.post('/journeys', _controllers.journeyControllers.create);
};

exports.default = routes;