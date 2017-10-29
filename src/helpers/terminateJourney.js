import Journey from '../models/Journey'
import { sendSms } from '../helpers'

const terminateJourney = mobileNumber => {
  return new Promise((resolve, reject) => {
    Journey.findOne({
      end: {$exists: false},
      mobileNumber
    })
    .then(journey => {
      if (!journey) {
        throw new Error('Journey not found')
      }
      Journey.update({_id: journey._id}, {$set: {end: new Date()}})
        .then(success => {
          sendSms(journey.mobileNumber, 'terminateReply')
          resolve()
        })
        .catch(reject)
    })
    .catch(error => reject(error))
  })
}

export default terminateJourney
