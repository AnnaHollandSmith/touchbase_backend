import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
  mobileNumber: String,
  type: String,
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const Message = mongoose.model('Message', messageSchema)

export default Message
