import { extendJourney } from '../../helpers'

const receive = (req, res, next) => {
  console.log('hello!!!!!!!!')
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
