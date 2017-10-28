'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restifyErrors = require('restify-errors');

var errors = _interopRequireWildcard(_restifyErrors);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Journey = require('../../models/Journey');

var _Journey2 = _interopRequireDefault(_Journey);

var _journeyTimeCalculator = require('../../helpers/journeyTimeCalculator');

var _journeyTimeCalculator2 = _interopRequireDefault(_journeyTimeCalculator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var create = function create(req, res, next) {
  var _req$body = req.body,
      origin = _req$body.origin,
      destination = _req$body.destination,
      mode = _req$body.mode;


  (0, _journeyTimeCalculator2.default)(origin, destination, mode).then(function (duration) {
    return (0, _moment2.default)().add(duration, 'seconds').toDate();
  }).then(function (etaDate) {
    req.body.eta = etaDate;

    var journey = new _Journey2.default(req.body);

    journey.save(function (error, savedJourney) {
      if (error) {
        return next(new errors.BadGatewayError('Couldn\'t save to database.'));
      }

      res.send(savedJourney);
    });
  }).catch(function (error) {
    return res.send(new Error(error));
  });
};

exports.default = create;