import request from 'request-promise'
import User from '../models/User'
import Message from '../models/Message'
import moment from 'moment'

function createMessage (messageType, fields, additional) {
  const messages = {
    extension: `Hi ${fields.name}, we've noticed you haven't yet touched base at your destination. To add 5 minutes to your journey, text TOUCHBASE EXTEND to 84433. If you have arrived text TOUCHBASE HOME to 84433`,
    extensionReply: `Hi ${fields.name}, we've extended your journey time by 5 minutes. Your new ETA is ${moment(additional.eta).format('HH:mm')}.`,
    terminateReply: `Thanks ${fields.name}. Glad you have made it home safely.`,
    contact: `Hi ${fields.name}, ${additional.name} is using the TouchBase app to get home safely. They have not marked their journey as complete. Please try and contact them on ${additional.mobileNumber}.`,
    escalate: `${process.env.KEYWORD}Police. Person Reported Missing. Last seen ${additional.start}. Mobile number ${additional.mobileNumber}. Last known coordinates ${additional.origin.lat}, ${additional.origin.lng}. Heading towards ${additional.destination.lat}, ${additional.destination.lng}`,
    register: `${process.env.KEYWORD}After reading ALL this message, SEND THE WORD '${process.env.KEYWORD}YES' TO ${process.env.NUMBER} TO COMPLETE YOUR REGISTRATION - otherwise your phone isn't registered. In an emergency, you will know your message has been received ONLY when you get a reply from an emergency service; until then try other methods. Full details, Terms & Conditions are available at www.emergencysms.org.uk`,
    registered: `${process.env.KEYWORD}Your telephone number is registered with the emergencySMS Service. Please don't reply to this message. For more information go to http://emergencySMS.org.uk`
  }

  return messages[messageType]
}

function getAppMessage (messageType, fields, additional) {
  const messages = {
    extension: `We've noticed you haven't yet touched base at your destination. To add 5 minutes to your journey, text TOUCHBASE EXTEND to 84433. If you have arrived text TOUCHBASE HOME to 84433`,
    extensionReply: `We've extended your journey time by 5 minutes. Your new ETA is ${moment(additional.eta).format('HH:mm')}.`,
    terminateReply: `Thanks ${fields.name}. Glad you have made it home safely.`,
    contact: `${additional.name} is using the TouchBase app to get home safely. They have not marked their journey as complete. Please try and contact them on ${additional.mobileNumber}.`,
    escalate: `${process.env.KEYWORD}Police. Person Reported Missing. Last seen ${additional.start}. Mobile number ${additional.mobileNumber}. Last known coordinates ${additional.origin.lat}, ${additional.origin.lng}. Heading towards ${additional.destination.lat}, ${additional.destination.lng}`,
    register: `${process.env.KEYWORD}After reading ALL this message, SEND THE WORD '${process.env.KEYWORD}YES' TO ${process.env.NUMBER} TO COMPLETE YOUR REGISTRATION - otherwise your phone isn't registered. In an emergency, you will know your message has been received ONLY when you get a reply from an emergency service; until then try other methods. Full details, Terms & Conditions are available at www.emergencysms.org.uk`,
    registered: `${process.env.KEYWORD}Your telephone number is registered with the emergencySMS Service. Please don't reply to this message. For more information go to http://emergencySMS.org.uk`
  }

  return messages[messageType]
}

const sendSms = (contacts, messageType, additional = {}) => {
  return new Promise((resolve, reject) => {
    const formatContactPromise = new Promise(resolve => {
      if (typeof contacts === 'string') {
        // contacts is a number so look up User
        if (contacts === process.env.NUMBER) {
          resolve([{
            mobileNumber: process.env.NUMBER
          }])
        } else {
          User.findOne({mobileNumber: contacts})
            .then(user => {
              resolve([user])
            })
        }
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

              resolve(getAppMessage(messageType, contact, additional))
            })
          })
          .catch(error => reject(new Error(error)))
      })
    })
  })
}

export default sendSms
