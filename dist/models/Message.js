'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messageSchema = _mongoose2.default.Schema({
  mobileNumber: String,
  type: String,
  createdAt: {
    type: Date,
    default: new Date()
  }
});

var Message = _mongoose2.default.model('Message', messageSchema);

exports.default = Message;