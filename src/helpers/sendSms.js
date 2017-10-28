import request from 'request-promise'
import User from '../models/User'

function createMessage (messageType, fields) {
  const messages = {
    extension: `Hi ${fields.name}, we've noticed you haven't yet touched base at your destination. To add 5 minutes to your journey, text EXTEND to 84433.`,
    extensionReply: `Hi ${fields.name}, we've extended your journey time by 5 minutes.`
  }

  return messages[messageType]
}

const sendSms = (contacts, messageType) => {
  return new Promise((resolve, reject) => {
    const formatContactPromise = new Promise(resolve => {
      if (typeof contacts === 'string') {
        // contacts is a number so look up User
        User.findOne({mobileNumber: contacts})
          .then(user => {
            resolve([user])
          })
      } else {
        resolve(contacts)
      }
    })

    formatContactPromise.then(contacts => {
      contacts.forEach(contact => {
        const content = createMessage(messageType, contact)

        request.post(`https://api.clockworksms.com/http/send.aspx?key=${process.env.CLOCKWORK_API_KEY}&to=${contact.mobileNumber}&content=${content}`)
        .then(response => resolve(response))
        .catch(error => reject(new Error(error)))
      })
    })
  })
}

export default sendSms
