import request from 'request-promise'
import { extendJourney, terminateJourney } from '../../helpers'
import Config from '../../models/Config'
import Journey from '../../models/Journey'

const receive = (req, res, next) => {
  const from = req.params.from
  let content = decodeURI(req.params.content)

  content = content.replace('TOUCHBASE ', '').toLowerCase()

  if (content.includes('escalate')) {
    const reference = Number(content.replace('escalate ', ''))

    Journey.findOne({reference})
      .then(journey => {
        send999Sms(process.env.NUMBER, `${process.env.KEYWORD}Police. Person Reported Missing. Last seen ${journey.start}. Mobile number ${journey.mobileNumber}. Last known coordinates ${journey.origin.lat}, ${journey.origin.lng}. Heading towards ${journey.destination.lat}, ${journey.destination.lng}`)
      })
  } else {
    switch (content) {
      case 'extend':
        console.log('extend')
        extendJourney(from)
          .then(response => {
            res.send(200)
            next()
          })
          .catch(() => {
            res.send(200)
            next()
          })
        break
      case 'home':
        console.log('home')
        terminateJourney(from)
            .then(response => {
              res.send(200)
              next()
            })
            .catch(() => {
              res.send(200)
              next()
            })
        break
      case 'register':
        console.log('register')
        send999Sms(from, `After reading ALL this message, SEND THE WORD '${process.env.KEYWORD}YES' TO ${process.env.NUMBER} TO COMPLETE YOUR REGISTRATION - otherwise your phone isn't registered. In an emergency, you will know your message has been received ONLY when you get a reply from an emergency service; until then try other methods. Full details, Terms & Conditions are available at www.emergencysms.org.uk`)
          .then(() => {
            res.send(200)
            next()
          })
        break
      case 'yes':
        Config.findOne({ key: 'is999Registered' })
          .then(configVar => {
            const registerPromise = new Promise((resolve, reject) => {
              if (!configVar) {
                const newConfig = new Config({
                  key: 'is999Registered',
                  value: true
                })

                newConfig.save((error, savedConfigVar) => {
                  if (error) {
                    console.log(error)
                    reject(error)
                  }

                  resolve()
                })
              } else {
                Config.update({ _id: configVar._id, key: 'is999Registered' }, { $set: { value: true } })
                .then(() => {
                  resolve()
                })
                .catch(reject)
              }
            })

            registerPromise
              .then(() => {
                send999Sms(from, `Your telephone number is registered with the emergencySMS Service. Please don't reply to this message. For more information go to http://emergencySMS.org.uk`)
                  .then(() => {
                    res.send(200)
                    next()
                  })
                  .catch(error => console.log(error))
              })
          })

        break
      default:
        if (content.includes('Police.')) {
          console.log('EMERGENCY REQUEST RECEIVED:' + content)
        } else {
          console.log('unhandled')
          res.send('unhandled')
        }
    }
  }
}

const send999Sms = (mobileNumber, message) => {
  return new Promise((resolve, reject) => {
    request.post(`https://api.clockworksms.com/http/send.aspx?key=${process.env.CLOCKWORK_API_KEY}&to=${mobileNumber}&content=${message}`)
      .then(resolve)
      .catch(reject)
  })
}

export default receive
