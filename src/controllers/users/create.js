import { parse, format } from 'libphonenumber-js'
import * as errors from 'restify-errors'
import User from '../../models/User'

const create = (req, res, next) => {
  const parsedMobileNumber = parse(req.body.mobileNumber, {
    country: {
      restrict: 'GB',
      default: 'GB'
    }
  })
  const formattedMobileNumber = format(parsedMobileNumber.phone, 'GB', 'International_plaintext').replace('+', '')
  req.body.mobileNumber = formattedMobileNumber

  const user = new User(req.body)

  user.save((error, savedUser) => {
    if (error) {
      return next(new Error(error))
    }

    res.send(savedUser)
  })
}

export default create
