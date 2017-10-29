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

var _Message = require('../models/Message');

var _Message2 = _interopRequireDefault(_Message);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cron = function cron() {
  console.log('crons initialised');

  _nodeSchedule2.default.scheduleJob('*/1 * * * *', function extendSms() {
    console.log('executing extend sms cron');
    var selector = {
      'end': { $exists: false }
    };

    _Journey2.default.find(selector).exec().then(function (journeys) {
      journeys.forEach(function (journey) {
        var now = new Date();

        if ((0, _moment2.default)(journey.eta).diff((0, _moment2.default)(now), 'minutes') <= 5) {
          var mobileNumber = journey.mobileNumber;


          _User2.default.findOne({ mobileNumber: mobileNumber }).then(function (user) {
            if (!user) {
              return;
            }

            _Message2.default.findOne({ mobileNumber: mobileNumber }, { createdAt: -1 }).then(function (message) {
              if (!message || (0, _moment2.default)(now).diff((0, _moment2.default)(message.date), 'minutes') >= 5) {
                (0, _helpers.sendSms)(user, 'extension').then(function (response) {
                  _Journey2.default.update({ _id: journey._id }, {
                    $set: { messageSent: true }
                  }).then(function (response) {
                    return console.log(response);
                  }).catch(function (error) {
                    return console.log(error);
                  });
                }).catch(function (error) {
                  return console.log(error);
                });
              }
            }).catch(function (error) {
              return console.log(error);
            });
          });
        }
      });
    });
  });
};

exports.default = cron;