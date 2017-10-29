import { extendJourney, terminateJourney } from '../../helpers'

const receive = (req, res, next) => {
  const from = req.params.from
  let content = decodeURI(req.params.content)

  content = content.replace('TOUCHBASE ', '').toLowerCase()

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
    default:
      console.log('unhandled')
      res.send('unhandled')
  }
}

export default receive
