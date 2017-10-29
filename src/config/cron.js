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
          'messages.extension.lastMessageSent': { $gte: messageThreshold }
        }, {
          'messages.extension.lastMessageSent': { $exists: false }
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

              const messages = {
                extension: {
                  lastMessageSent: new Date()
                }
              }

              sendSms(user, 'extension')
                .then(response => {
                  Journey.update({ _id: journey._id }, {
                    $set: { messages }
                  })
                })
            })
        })
      })
  })
}

export default cron
