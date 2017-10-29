import nodeSchedule from 'node-schedule'
import moment from 'moment'
import Journey from '../models/Journey'
import User from '../models/User'
import { sendSms } from '../helpers'

const cron = () => {
  console.log('crons initialised')

  nodeSchedule.scheduleJob('*/1 * * * *', function extendSms () {
    console.log('executing extend sms cron')
    const messageThreshold = moment().subtract(5, 'minutes').toDate()
    const selector = {
      'end': { $exists: false },
      'eta': { $gte: messageThreshold },
      $or: [
        {
          lastMessageSent: { $gte: messageThreshold }
        }, {
          lastMessageSent: { $exists: false }
        }
      ]
    }

    Journey.find(selector).exec()
      .then(journeys => {
        journeys.forEach(journey => {
          User.findOne({ mobileNumber: journey.mobileNumber })
            .then(user => {
              if (!user) {
                return
              }

              sendSms(user, 'extension')
                .then(response => {
                  Journey.update({ _id: journey._id }, {
                    $set: { lastMessageSent: new Date() }
                  })
                  .then(response => console.log(response))
                  .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
            })
        })
      })
  })
}

export default cron
