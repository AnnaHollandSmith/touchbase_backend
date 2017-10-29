'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Journey = require('../models/Journey');

var _Journey2 = _interopRequireDefault(_Journey);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cron = function cron() {
  console.log('crons initialised');

  _nodeSchedule2.default.scheduleJob('*/1 * * * *', function extendSms() {
    console.log('executing extend sms cron');
    var messageThreshold = (0, _moment2.default)().subtract(5, 'minutes').toDate();
    var selector = {
      'end': { $exists: false },
      'eta': { $gte: messageThreshold },
      $or: [{
        lastMessageSent: { $gte: messageThreshold }
      }, {
        lastMessageSent: { $exists: false }
      }]
    };

    _Journey2.default.find(selector).exec().then(function (journeys) {
      journeys.forEach(function (journey) {
        _User2.default.findOne({ mobileNumber: journey.mobileNumber }).then(function (user) {
          if (!user) {
            return;
          }

          (0, _helpers.sendSms)(user, 'extension').then(function (response) {
            _Journey2.default.update({ _id: journey._id }, {
              $set: { lastMessageSent: new Date() }
            }).then(function (response) {
              return console.log(response);
            }).catch(function (error) {
              return console.log(error);
            });
          }).catch(function (error) {
            return console.log(error);
          });
        });
      });
    });
  });
};

exports.default = cron;