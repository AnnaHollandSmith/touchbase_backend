'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _helpers = require('../../helpers');

var _Config = require('../../models/Config');

var _Config2 = _interopRequireDefault(_Config);

var _Journey = require('../../models/Journey');

var _Journey2 = _interopRequireDefault(_Journey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var receive = function receive(req, res, next) {
  var from = req.params.from;
  var content = decodeURI(req.params.content);

  content = content.replace('TOUCHBASE ', '').toLowerCase();

  if (content.includes('escalate')) {
    var reference = Number(content.replace('escalate ', ''));

    _Journey2.default.findOne({ reference: reference }).then(function (journey) {
      send999Sms(process.env.NUMBER, process.env.KEYWORD + 'Police. Person Reported Missing. Last seen ' + journey.start + '. Mobile number ' + journey.mobileNumber + '. Last known coordinates ' + journey.origin.lat + ', ' + journey.origin.lng + '. Heading towards ' + journey.destination.lat + ', ' + journey.destination.lng).then(function () {
        res.send(200);
        next();
      });
    });
  } else {
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
        send999Sms(from, 'After reading ALL this message, SEND THE WORD \'' + process.env.KEYWORD + 'YES\' TO ' + process.env.NUMBER + ' TO COMPLETE YOUR REGISTRATION - otherwise your phone isn\'t registered. In an emergency, you will know your message has been received ONLY when you get a reply from an emergency service; until then try other methods. Full details, Terms & Conditions are available at www.emergencysms.org.uk').then(function () {
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
            send999Sms(from, 'Your telephone number is registered with the emergencySMS Service. Please don\'t reply to this message. For more information go to http://emergencySMS.org.uk').then(function () {
              res.send(200);
              next();
            }).catch(function (error) {
              return console.log(error);
            });
          });
        });

        break;
      default:
        if (content.includes('Police.')) {
          console.log('EMERGENCY REQUEST RECEIVED:' + content);
        } else {
          console.log('unhandled');
          res.send('unhandled');
        }
    }
  }
};

var send999Sms = function send999Sms(mobileNumber, message) {
  return new Promise(function (resolve, reject) {
    _requestPromise2.default.post('https://api.clockworksms.com/http/send.aspx?key=' + process.env.CLOCKWORK_API_KEY + '&to=' + mobileNumber + '&content=' + message).then(resolve).catch(reject);
  });
};

exports.default = receive;