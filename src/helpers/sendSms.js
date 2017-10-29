import request from 'request-promise'
import User from '../models/User'
import Message from '../models/Message'
import moment from 'moment'

function createMessage (messageType, fields, additional) {
  const messages = {
    extension: `Hi ${fields.name}, we've noticed you haven't yet touched base at your destination. To add 5 minutes to your journey, text EXTEND to 84433.`,
    extensionReply: `Hi ${fields.name}, we've extended your journey time by 5 minutes. Your new ETA is ${moment(additional.eta).format('HH:mm')}.`
  }

  return messages[messageType]
}

const sendSms = (contacts, messageType, additional = {}) => {
  return new Promise((resolve, reject) => {
    const formatContactPromise = new Promise(resolve => {
      if (typeof contacts === 'string') {
        // contacts is a number so look up User
        User.findOne({mobileNumber: contacts})
          .then(user => {
            resolve([user])
          })
      } else {
        if (!Array.isArray(contacts)) {
          contacts = [contacts]
        }

        resolve(contacts)
      }
    })

    formatContactPromise.then(contacts => {
      contacts.forEach(contact => {
        const content = createMessage(messageType, contact, additional)

        const { mobileNumber } = contact

        request.post(`https://api.clockworksms.com/http/send.aspx?key=${process.env.CLOCKWORK_API_KEY}&to=${mobileNumber}&content=${content}`)
          .then(response => {
            const message = new Message({
              mobileNumber,
              type: messageType
            })

            message.save((error, savedMessage) => {
              if (error) {
                throw new Error(error)
              }

              resolve(response)
            })
          })
          .catch(error => reject(new Error(error)))
      })
    })
  })
}

export default sendSms
