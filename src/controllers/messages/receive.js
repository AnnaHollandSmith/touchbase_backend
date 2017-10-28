import { extendJourney } from '../../helpers'

const receive = (req, res, next) => {
  console.log('hello!!!!!!!!')
  const from = req.query.from
  let content = req.query.content

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
