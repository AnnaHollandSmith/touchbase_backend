'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Message = require('../models/Message');

var _Message2 = _interopRequireDefault(_Message);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMessage(messageType, fields, additional) {
  var messages = {
    extension: 'Hi ' + fields.name + ', we\'ve noticed you haven\'t yet touched base at your destination. To add 5 minutes to your journey, text TBS EXTEND to 84433. If you have arrived text TBS HOME to 84433',
    extensionReply: 'Hi ' + fields.name + ', we\'ve extended your journey time by 5 minutes. Your new ETA is ' + (0, _moment2.default)(additional.eta).format('HH:mm') + '.',
    terminateReply: 'Thanks ' + fields.name + '. Glad you have made it home safely.',
    contact: 'Hi ' + fields.name + ', ' + additional.name + ' is using the TouchBase app to get home safely. They have not marked their journey as complete. Please try and contact them on ' + additional.mobileNumber + '.',
    escalate: process.env.KEYWORD + 'Police. Person Reported Missing. Last seen ' + additional.start + '. Mobile number ' + additional.mobileNumber + '. Last known coordinates ' + additional.origin.lat + ', ' + additional.origin.lng + '. Heading towards ' + additional.destination.lat + ', ' + additional.destination.lng,
    register: process.env.KEYWORD + 'After reading ALL this message, SEND THE WORD \'' + process.env.KEYWORD + 'YES\' TO ' + process.env.NUMBER + ' TO COMPLETE YOUR REGISTRATION - otherwise your phone isn\'t registered. In an emergency, you will know your message has been received ONLY when you get a reply from an emergency service; until then try other methods. Full details, Terms & Conditions are available at www.emergencysms.org.uk',
    registered: process.env.KEYWORD + 'Your telephone number is registered with the emergencySMS Service. Please don\'t reply to this message. For more information go to http://emergencySMS.org.uk'
  };

  return messages[messageType];
}

function getAppMessage(messageType, fields, additional) {
  var messages = {
    extension: 'We\'ve noticed you haven\'t yet touched base at your destination. To add 5 minutes to your journey, text TBS EXTEND to 84433. If you have arrived text TBS HOME to 84433',
    extensionReply: 'We\'ve extended your journey time by 5 minutes. Your new ETA is ' + (0, _moment2.default)(additional.eta).format('HH:mm') + '.',
    terminateReply: 'Thanks ' + fields.name + '. Glad you have made it home safely.',
    contact: additional.name + ' is using the TouchBase app to get home safely. They have not marked their journey as complete. Please try and contact them on ' + additional.mobileNumber + '.',
    escalate: process.env.KEYWORD + 'Police. Person Reported Missing. Last seen ' + additional.start + '. Mobile number ' + additional.mobileNumber + '. Last known coordinates ' + additional.origin.lat + ', ' + additional.origin.lng + '. Heading towards ' + additional.destination.lat + ', ' + additional.destination.lng,
    register: process.env.KEYWORD + 'After reading ALL this message, SEND THE WORD \'' + process.env.KEYWORD + 'YES\' TO ' + process.env.NUMBER + ' TO COMPLETE YOUR REGISTRATION - otherwise your phone isn\'t registered. In an emergency, you will know your message has been received ONLY when you get a reply from an emergency service; until then try other methods. Full details, Terms & Conditions are available at www.emergencysms.org.uk',
    registered: process.env.KEYWORD + 'Your telephone number is registered with the emergencySMS Service. Please don\'t reply to this message. For more information go to http://emergencySMS.org.uk'
  };

  return messages[messageType];
}

var sendSms = function sendSms(contacts, messageType) {
  var additional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return new Promise(function (resolve, reject) {
    var formatContactPromise = new Promise(function (resolve) {
      if (typeof contacts === 'string') {
        // contacts is a number so look up User
        if (contacts === process.env.NUMBER) {
          resolve([{
            mobileNumber: process.env.NUMBER
          }]);
        } else {
          _User2.default.findOne({ mobileNumber: contacts }).then(function (user) {
            resolve([user]);
          });
        }
      } else {
        if (!Array.isArray(contacts)) {
          contacts = [contacts];
        }

        resolve(contacts);
      }
    });

    formatContactPromise.then(function (contacts) {
      contacts.forEach(function (contact) {
        var content = createMessage(messageType, contact, additional);

        var mobileNumber = contact.mobileNumber;


        _requestPromise2.default.post('https://api.clockworksms.com/http/send.aspx?key=' + process.env.CLOCKWORK_API_KEY + '&to=' + mobileNumber + '&content=' + content).then(function (response) {
          var message = new _Message2.default({
            mobileNumber: mobileNumber,
            type: messageType
          });

          message.save(function (error, savedMessage) {
            if (error) {
              throw new Error(error);
            }

            resolve(getAppMessage(messageType, contact, additional));
          });
        }).catch(function (error) {
          return reject(new Error(error));
        });
      });
    });
  });
};

exports.default = sendSms;