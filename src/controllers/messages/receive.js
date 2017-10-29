import { extendJourney, terminateJourney } from '../../helpers'
import Config from '../../models/Config'
import Journey from '../../models/Journey'
import sendSms from '../../helpers/sendSms'

const receive = (req, res, next) => {
  const from = req.params.from
  let content = decodeURI(req.params.content)

  content = content.replace('TBS ', '').toLowerCase()

  if (content.includes('escalate')) {
    console.log('escalate')

    const reference = Number(content.replace('escalate ', ''))
    console.log('Reference' + reference)

    Journey.findOne({reference})
      .then(journey => {
        console.log('sending sms')
        sendSms(process.env.OUR_NUMBER, 'escalate', journey)
          .then(() => {
            res.send(200)
            next()
          })
      })
  } else {
    console.log('content var:' + content)
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
        sendSms(process.env.OUR_NUMBER, 'register')
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
                sendSms(process.env.NUMBER, 'registered')
                res.send(200)
                next()
              })
          })
        break
      default:
        if (content.includes('Police.')) {
          console.log('EMERGENCY REQUEST RECEIVED:' + content)
          res.send(200)
        } else {
          console.log('unhandled')
          res.send(200)
        }
    }
  }
}

export default receive
