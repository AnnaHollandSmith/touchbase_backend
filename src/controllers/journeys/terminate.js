import { terminateJourney } from '../../helpers'

const terminate = (req, res, next) => {
  terminateJourney(req.body.mobileNumber)
    .then(success => res.send({ success: 'Journey ended' }))
    .catch(error => res.send(new Error(error)))
}

export default terminate
