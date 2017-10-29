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
        .catch(error => {
          res.send(error)
          next()
        })
      break
    case 'home':
      console.log('home')
      terminateJourney(from)
          .then(response => {
            console.log(response)
            res.send(200)
            next()
          })
          .catch(error => {
            console.log(error)
            res.send(error)
            next()
          })
      break
    default:
      console.log('unhandled')
      res.send('unhandled')
  }
}

export default receive
