import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  }
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
})

const User = mongoose.model('User', userSchema)

export default User
