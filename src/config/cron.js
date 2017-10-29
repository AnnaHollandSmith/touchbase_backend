import nodeSchedule from 'node-schedule'
import moment from 'moment'
import Journey from '../models/Journey'
import User from '../models/User'
import Message from '../models/Message'
import { sendSms } from '../helpers'

const cron = () => {
  console.log('crons initialised')

  function extendSms () {
    console.log('executing extend sms cron')

    const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate()

    const selector = {
      'end': { $exists: false },
      'eta': { $lte: new Date(), $gte: fiveMinutesAgo }
    }

    Journey.find(selector).exec()
      .then(journeys => {
        journeys.forEach(journey => {
          const now = new Date()

          if (moment(journey.eta).diff(moment(now), 'minutes') <= 5) {
            const { mobileNumber } = journey

            User.findOne({ mobileNumber })
            .then(user => {
              if (!user) {
                return
              }

              Message.findOne({ mobileNumber, type: 'extension' }, { createdAt: -1 })
                .then(message => {
                  if (!message || moment(now).diff(moment(message.date), 'minutes') >= 5) {
                    sendSms(user, 'extension')
                  }
                })
                .catch(error => console.log(error))
            })
          }
        })
      })
  }

  function contactsSms () {
    console.log('executing contact sms cron')
    const selector = {
      'end': { $exists: false },
      'eta': { $lte: new Date() }
    }

    Journey.find(selector).exec()
      .then(journeys => {
        journeys.forEach(journey => {
          if (moment().toDate() > moment(journey.eta).toDate()) {
            const { mobileNumber } = journey

            User.findOne({ mobileNumber })
              .then(user => {
                if (!user) {
                  return
                }

                journey.contacts.forEach(contact => {
                  Message.findOne({ mobileNumber: contact.mobileNumber, type: 'contact' }, { createdAt: -1 })
                    .then(message => {
                      if (!message) {
                        sendSms(contact, 'contact', {
                          name: user.name,
                          mobileNumber
                        })
                      }
                    })
                    .catch(error => console.log(error))
                })
              })
          }
        })
      })
      .catch()
  }

  nodeSchedule.scheduleJob('*/1 * * * *', () => {
    extendSms()
    contactsSms()
  })
}

export default cron
