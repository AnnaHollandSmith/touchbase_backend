import Journey from '../models/Journey'
import moment from 'moment'
import { sendSms } from '../helpers'

const extendJourney = mobileNumber => {
  return new Promise((resolve, reject) => {
    Journey.findOne({
      end: {$exists: false},
      mobileNumber
    })
    .then(journey => {
      if (!journey) {
        throw new Error('Journey not found')
      }
      const newEta = moment(journey.eta).add(5, 'minutes').toDate()
      Journey.update({_id: journey._id}, {$set: {eta: newEta}})
        .then(success => {
          sendSms(journey.mobileNumber, 'extensionReply', { eta: newEta })
            .then(message => {
              resolve(message)
            })
        })
        .catch(reject)
    })
    .catch(error => reject(error))
  })
}

export default extendJourney
