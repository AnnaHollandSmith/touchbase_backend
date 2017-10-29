'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configSchema = new _mongoose2.default.Schema({
  key: {
    type: String,
    required: true
  },
  value: Boolean
});

var Config = _mongoose2.default.model('Config', configSchema);

exports.default = Config;