'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Journey = require('../models/Journey');

var _Journey2 = _interopRequireDefault(_Journey);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var terminateJourney = function terminateJourney(mobileNumber) {
  return new Promise(function (resolve, reject) {
    _Journey2.default.findOne({
      end: { $exists: false },
      mobileNumber: mobileNumber
    }).then(function (journey) {
      console.log(journey);
      if (!journey) {
        throw new Error('Journey not found');
      }
      _Journey2.default.update({ _id: journey._id }, { $set: { end: new Date() } }).then(function (success) {
        console.log(success);
        (0, _helpers.sendSms)(journey.mobileNumber, 'terminateReply');
        resolve();
      }).catch(function (error) {
        console.log(error);
        reject(error);
      });
    }).catch(function (error) {
      return reject(error);
    });
  });
};

exports.default = terminateJourney;