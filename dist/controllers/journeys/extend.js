'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../helpers');

var extend = function extend(req, res, next) {
  (0, _helpers.extendJourney)(req.body.mobileNumber).then(function (message) {
    return res.send({ message: message });
  }).catch(function (error) {
    return res.send(new Error(error));
  });
};

exports.default = extend;