import * as errors from 'restify-errors'
import { journeyTimeCalculator } from '../../helpers'

const calculate = (req, res, next) => {
  const {origin, destination, mode} = req.query

  journeyTimeCalculator(origin, destination, mode)
    .then(duration => {
      res.send({duration})
    })
    .catch(error => next(new errors.BadGatewayError(error)))
}

export default calculate
