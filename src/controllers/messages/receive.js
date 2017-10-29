import request from 'request-promise'
import { extendJourney, terminateJourney } from '../../helpers'
import Config from '../../models/Config'
import Journey from '../../models/Journey'
import sendSms from '../../helpers/sendSms'

const receive = (req, res, next) => {
  const from = req.params.from
  let content = decodeURI(req.params.content)

  content = content.replace('TOUCHBASE ', '').toLowerCase()

  if (content.includes('escalate')) {
    const reference = Number(content.replace('escalate ', ''))

    Journey.findOne({reference})
      .then(journey => {
        sendSms(process.env.NUMBER, 'escalate')
        res.send(200)
        next()
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
        sendSms(process.env.NUMBER, 'register')
        res.send(200)
        next()
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
        } else {
          console.log('unhandled')
          res.send('unhandled')
        }
    }
  }
}

export default receive
