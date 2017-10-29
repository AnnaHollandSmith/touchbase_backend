'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var latLng = {
  lat: {
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  }
};

var journeySchema = _mongoose2.default.Schema({
  origin: latLng,
  destination: latLng,
  mode: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    default: new Date()
  },
  eta: Date,
  end: Date,
  mobileNumber: String,
  contacts: [{
    name: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: true
    }
  }],
  lastMessageSent: Date
});

var Journey = _mongoose2.default.model('Journey', journeySchema);

exports.default = Journey;