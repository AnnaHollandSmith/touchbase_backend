'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Journey = require('../models/Journey');

var _Journey2 = _interopRequireDefault(_Journey);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extendJourney = function extendJourney(mobileNumber) {
  return new Promise(function (resolve, reject) {
    _Journey2.default.findOne({
      end: { $exists: false },
      mobileNumber: mobileNumber
    }).then(function (journey) {
      if (!journey) {
        throw new Error('Journey not found');
      }
      var newEta = (0, _moment2.default)(journey.eta).add(5, 'minutes').toDate();
      _Journey2.default.update({ _id: journey._id }, { $set: { eta: newEta } }).then(function (success) {
        (0, _helpers.sendSms)(journey.mobileNumber, 'extensionReply', { eta: newEta }).then(function (message) {
          resolve(message);
        });
      }).catch(reject);
    }).catch(function (error) {
      return reject(error);
    });
  });
};

exports.default = extendJourney;