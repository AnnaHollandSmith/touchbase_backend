import { extendJourney } from '../../helpers'

const receive = (req, res, next) => {
  console.log('hello!!!!!!!!')
  const from = req.params.from
  let content = decodeURI(req.params.content)

  content = content.replace('TOUCHBASE ', '').toLowerCase()

  console.log(content)
  switch (content) {
    case 'extend':
      console.log('we have made it here...')
      extendJourney(from).then(res.send('OK')).catch(error => {
        console.log(error)

        res.send(error)
      })
      break
    default:
      console.log('unhandled')
      res.send('unhandled')
  }
}

export default receive
