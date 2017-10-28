'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _libphonenumberJs = require('libphonenumber-js');

var _restifyErrors = require('restify-errors');

var errors = _interopRequireWildcard(_restifyErrors);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var create = function create(req, res, next) {
  var parsedMobileNumber = (0, _libphonenumberJs.parse)(req.body.mobileNumber, {
    country: {
      restrict: 'GB',
      default: 'GB'
    }
  });
  var formattedMobileNumber = (0, _libphonenumberJs.format)(parsedMobileNumber.phone, 'GB', 'International_plaintext').replace('+', '');
  req.body.mobileNumber = formattedMobileNumber;

  var user = new _User2.default(req.body);

  user.save(function (error, savedUser) {
    if (error) {
      return next(new Error(error));
    }

    res.send(savedUser);
  });
};

exports.default = create;