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

  function extendSms() {
    console.log('executing extend sms cron');

    var fiveMinutesAgo = (0, _moment2.default)().subtract(5, 'minutes').toDate();

    var selector = {
      'end': { $exists: false },
      'eta': { $lte: new Date(), $gte: fiveMinutesAgo }
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

            _Message2.default.findOne({ mobileNumber: mobileNumber, type: 'extension' }, { createdAt: -1 }).then(function (message) {
              if (!message || (0, _moment2.default)(now).diff((0, _moment2.default)(message.date), 'minutes') >= 5) {
                (0, _helpers.sendSms)(user, 'extension');
              }
            }).catch(function (error) {
              return console.log(error);
            });
          });
        }
      });
    });
  }

  function contactsSms() {
    console.log('executing contact sms cron');
    var selector = {
      'end': { $exists: false },
      'eta': { $lte: new Date() }
    };

    _Journey2.default.find(selector).exec().then(function (journeys) {
      journeys.forEach(function (journey) {
        if ((0, _moment2.default)().toDate() > (0, _moment2.default)(journey.eta).toDate()) {
          var mobileNumber = journey.mobileNumber;


          _User2.default.findOne({ mobileNumber: mobileNumber }).then(function (user) {
            if (!user) {
              return;
            }

            journey.contacts.forEach(function (contact) {
              _Message2.default.findOne({ mobileNumber: mobileNumber, type: 'contact' }, { createdAt: -1 }).then(function (message) {
                if (!message) {
                  (0, _helpers.sendSms)(contact, 'contact', {
                    name: user.name,
                    mobileNumber: mobileNumber
                  });
                }
              }).catch(function (error) {
                return console.log(error);
              });
            });
          });
        }
      });
    }).catch();
  }

  _nodeSchedule2.default.scheduleJob('*/1 * * * *', function () {
    extendSms();
    contactsSms();
  });
};

exports.default = cron;