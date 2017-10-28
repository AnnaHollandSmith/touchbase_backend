'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = _mongoose2.default.Schema({
  name: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
    // homeAddress: {
    //   lat: {
    //     type: Number,
    //     required: true
    //   },
    //   lng: {
    //     type: Number,
    //     required: true
    //   }
    // }
  } });

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;