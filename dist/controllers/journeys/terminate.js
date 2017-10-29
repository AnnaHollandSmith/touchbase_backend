'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../helpers');

var terminate = function terminate(req, res, next) {
  (0, _helpers.terminateJourney)(req.body.mobileNumber).then(function (success) {
    return res.send({ success: 'Journey ended' });
  }).catch(function (error) {
    return res.send(new Error(error));
  });
};

exports.default = terminate;