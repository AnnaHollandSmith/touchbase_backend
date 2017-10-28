import User from '../../models/User'

const single = (req, res, next) => {
  User.findOne({ mobileNumber: req.params.mobileNumber })
    .then(user => {
      if (!user) {
        throw new Error('User does not exist')
      }
      res.send(user)
    })
    .catch(error => res.send(error))
}

export default single
