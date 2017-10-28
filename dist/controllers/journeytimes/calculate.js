'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restifyErrors = require('restify-errors');

var errors = _interopRequireWildcard(_restifyErrors);

var _helpers = require('../../helpers');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var calculate = function calculate(req, res, next) {
  var _req$query = req.query,
      origin = _req$query.origin,
      destination = _req$query.destination,
      mode = _req$query.mode;


  (0, _helpers.journeyTimeCalculator)(origin, destination, mode).then(function (duration) {
    res.send({ duration: duration });
  }).catch(function (error) {
    return next(new errors.BadGatewayError(error));
  });
};

exports.default = calculate;