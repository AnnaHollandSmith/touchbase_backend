import * as errors from 'restify-errors'
import moment from 'moment'
import Journey from '../../models/Journey'
import journeyTimeCalculator from '../../helpers/journeyTimeCalculator'

const create = (req, res, next) => {
  const { origin, destination, mode } = req.body

  journeyTimeCalculator(origin, destination, mode)
    .then(duration => moment().add(duration, 'seconds').toDate())
    .then(etaDate => {
      req.body.eta = etaDate

      const journey = new Journey(req.body)

      journey.save((error, savedJourney) => {
        if (error) {
          return next(new errors.BadGatewayError(`Couldn't save to database.`))
        }

        res.send(savedJourney)
      })
    })
    .catch(error => res.send(new Error(error)))
}

export default create
