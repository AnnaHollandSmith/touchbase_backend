import Journey from '../../models/Journey'

const find = (req, res, next) => {
  Journey.findOne({
    mobileNumber: req.params.mobileNumber,
    start : { $exists: true },
    end : { $exists: false }
  })
    .then(journey => {
      if (!journey) {
        throw new Error('Journey does not exist')
      }
      res.send(journey)
    })
    .catch(error => res.send(error))
}

export default find
