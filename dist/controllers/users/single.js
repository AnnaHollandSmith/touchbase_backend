'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var single = function single(req, res, next) {
  _User2.default.findOne({ mobileNumber: req.params.mobileNumber }).then(function (user) {
    if (!user) {
      throw new Error('User does not exist');
    }
    res.send(user);
  }).catch(function (error) {
    return res.send(error);
  });
};

exports.default = single;