import mongoose from 'mongoose'

const latLng = {
  lat: {
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  }
}

const journeySchema = mongoose.Schema({
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
  contacts: [
    {
      name: {
        type: String,
        required: true
      },
      mobileNumber: {
        type: String,
        required: true
      }
    }
  ],
  messages: {
    extension: {
      lastMessageSent: Date
    }
  }
})

const Journey = mongoose.model('Journey', journeySchema)

export default Journey
