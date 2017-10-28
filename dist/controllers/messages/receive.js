'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../helpers');

var receive = function receive(req, res, next) {
  var from = req.query.from;
  var content = req.query.content;

  content = content.replace('TOUCHBASE ', '').toLowerCase();

  console.log(content);
  switch (content) {
    case 'extend':
      console.log('we have made it here...');
      (0, _helpers.extendJourney)(from).then(res.send('OK')).catch(function (error) {
        return res.send(error);
      });
      break;
    default:
      res.send('unhandled');
  }
};

exports.default = receive;