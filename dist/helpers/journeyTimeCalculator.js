'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var journeyTimeCalculator = function journeyTimeCalculator(origin, destination, mode) {
  return new Promise(function (resolve, reject) {
    _requestPromise2.default.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&mode=' + mode + '&traffic_model=pessimistic&key=' + process.env.GOOGLE_API_KEY + '&departure_time=now').then(function (response) {
      return JSON.parse(response);
    }).then(function (responseObject) {
      var duration = responseObject.routes[0].legs.reduce(function (total, leg) {
        return total + leg.distance.value;
      }, 0);
      resolve(duration);
    }).catch(function (error) {
      return reject(error);
    });
  });
};

exports.default = journeyTimeCalculator;