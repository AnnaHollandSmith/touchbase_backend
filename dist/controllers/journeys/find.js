'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Journey = require('../../models/Journey');

var _Journey2 = _interopRequireDefault(_Journey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var find = function find(req, res, next) {
  _Journey2.default.findOne({
    mobileNumber: req.params.mobileNumber,
    start: { $exists: true },
    end: { $exists: false }
  }).then(function (journey) {
    if (!journey) {
      throw new Error('Journey does not exist');
    }
    res.send(journey);
  }).catch(function (error) {
    return res.send(error);
  });
};

exports.default = find;