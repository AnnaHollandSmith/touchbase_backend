'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../helpers');

var receive = function receive(req, res, next) {
  var from = req.params.from;
  var content = decodeURI(req.params.content);

  content = content.replace('TOUCHBASE ', '').toLowerCase();

  switch (content) {
    case 'extend':
      console.log('extend');
      (0, _helpers.extendJourney)(from).then(function (response) {
        res.send(200);
        next();
      }).catch(function () {
        res.send(200);
        next();
      });
      break;
    case 'home':
      console.log('home');
      (0, _helpers.terminateJourney)(from).then(function (response) {
        res.send(200);
        next();
      }).catch(function () {
        res.send(200);
        next();
      });
      break;
    default:
      console.log('unhandled');
      res.send('unhandled');
  }
};

exports.default = receive;