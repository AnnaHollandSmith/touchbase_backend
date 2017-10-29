import mongoose from 'mongoose'

const configSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: Boolean
})

const Config = mongoose.model('Config', configSchema)

export default Config
