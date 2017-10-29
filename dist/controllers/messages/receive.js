'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../helpers');

var _Config = require('../../models/Config');

var _Config2 = _interopRequireDefault(_Config);

var _Journey = require('../../models/Journey');

var _Journey2 = _interopRequireDefault(_Journey);

var _sendSms = require('../../helpers/sendSms');

var _sendSms2 = _interopRequireDefault(_sendSms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var receive = function receive(req, res, next) {
  var from = req.params.from;
  var content = decodeURI(req.params.content);

  content = content.replace('TBS ', '').toLowerCase();

  if (content.includes('escalate')) {
    console.log('escalate');

    var reference = Number(content.replace('escalate ', ''));
    console.log('Reference' + reference);

    _Journey2.default.findOne({ reference: reference }).then(function (journey) {
      console.log('sending sms');
      (0, _sendSms2.default)(process.env.OUR_NUMBER, 'escalate', journey).then(function () {
        res.send(200);
        next();
      });
    });
  } else {
    console.log('content var:' + content);
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
      case 'register':
        console.log('register');
        (0, _sendSms2.default)(process.env.OUR_NUMBER, 'register').then(function () {
          res.send(200);
          next();
        });
        break;
      case 'yes':
        _Config2.default.findOne({ key: 'is999Registered' }).then(function (configVar) {
          var registerPromise = new Promise(function (resolve, reject) {
            if (!configVar) {
              var newConfig = new _Config2.default({
                key: 'is999Registered',
                value: true
              });

              newConfig.save(function (error, savedConfigVar) {
                if (error) {
                  console.log(error);
                  reject(error);
                }

                resolve();
              });
            } else {
              _Config2.default.update({ _id: configVar._id, key: 'is999Registered' }, { $set: { value: true } }).then(function () {
                resolve();
              }).catch(reject);
            }
          });

          registerPromise.then(function () {
            (0, _sendSms2.default)(process.env.NUMBER, 'registered');
            res.send(200);
            next();
          });
        });
        break;
      default:
        if (content.includes('Police.')) {
          console.log('EMERGENCY REQUEST RECEIVED:' + content);
          res.send(200);
        } else {
          console.log('unhandled');
          res.send(200);
        }
    }
  }
};

exports.default = receive;