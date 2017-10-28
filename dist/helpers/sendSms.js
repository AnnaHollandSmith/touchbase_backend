'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMessage(messageType, fields) {
  var messages = {
    extension: 'Hi ' + fields.name + ', we\'ve noticed you haven\'t yet touched base at your destination. To add 5 minutes to your journey, text EXTEND to 84433.',
    extensionReply: 'Hi ' + fields.name + ', we\'ve extended your journey time by 5 minutes.'
  };

  return messages[messageType];
}

var sendSms = function sendSms(contacts, messageType) {
  return new Promise(function (resolve, reject) {
    var formatContactPromise = new Promise(function (resolve) {
      if (typeof contacts === 'string') {
        // contacts is a number so look up User
        _User2.default.findOne({ mobileNumber: contacts }).then(function (user) {
          resolve([user]);
        });
      } else {
        resolve(contacts);
      }
    });

    formatContactPromise.then(function (contacts) {
      contacts.forEach(function (contact) {
        var content = createMessage(messageType, contact);

        _requestPromise2.default.post('https://api.clockworksms.com/http/send.aspx?key=' + process.env.CLOCKWORK_API_KEY + '&to=' + contact.mobileNumber + '&content=' + content).then(function (response) {
          return resolve(response);
        }).catch(function (error) {
          return reject(new Error(error));
        });
      });
    });
  });
};

exports.default = sendSms;