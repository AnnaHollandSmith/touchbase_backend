import { extendJourney } from '../../helpers'

const extend = (req, res, next) => {
  extendJourney(req.body.mobileNumber)
    .then(message => res.send({ message }))
    .catch(error => res.send(new Error(error)))
}

export default extend
