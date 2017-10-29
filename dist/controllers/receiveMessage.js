'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _Config = require('../models/Config');

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var receive = function receive(req, res, next) {
  var from = req.params.from;
  var content = decodeURI(req.params.content);

  content = content.replace('TOUCHBASE ', '').toLowerCase();

  switch (content) {
    case 'register':
      console.log('register');
      sendSms(from, 'After reading ALL this message, SEND THE WORD \'' + process.env.KEYWORD + 'YES\' TO ' + process.env.NUMBER + ' TO COMPLETE YOUR REGISTRATION - otherwise your phone isn\'t registered. In an emergency, you will know your message has been received ONLY when you get a reply from an emergency service; until then try other methods. Full details, Terms & Conditions are available at www.emergencysms.org.uk').then(function () {
        res.send(200);
        next();
      });
      break;
    case 'yes':
      _Config2.default.findOne({ key: 'is999Registered' }).then(function (configVar) {
        if (!configVar) {
          var newConfig = new _Config2.default({
            key: 'is999Registered',
            value: true
          });

          newConfig.save(function (error, savedConfigVar) {
            if (error) {
              throw new Error(error);
            }

            sendSms(from, 'Your telephone number is registered with the emergencySMS Service. Please don\'t reply to this message. For more information go to http://emergencySMS.org.uk').then(function () {
              res.send(200);
              next();
            });
          });
        } else {
          _Config2.default.update({ _id: configVar._id, key: 'is999Registered' }, { $set: { value: true } });

          sendSms(from, 'Your telephone number is registered with the emergencySMS Service. Please don\'t reply to this message. For more information go to http://emergencySMS.org.uk').then(function () {
            res.send(200);
            next();
          });
        }
      });
      break;
    default:
      console.log('unhandled');
      res.send('unhandled');
  }
};

var sendSms = function sendSms(mobileNumber, message) {
  return new Promise(function (resolve, reject) {
    _requestPromise2.default.post('https://api.clockworksms.com/http/send.aspx?key=' + process.env.CLOCKWORK_API_KEY + '&to=' + mobileNumber + '&content=' + message).then(resolve).catch(reject);
  });
};

exports.default = receive;