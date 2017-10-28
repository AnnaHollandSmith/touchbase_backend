import restify from 'restify'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import routes from './routes'
import { cron } from './config'

mongoose.Promise = global.Promise

dotenv.config({
  path: path.join(__dirname, '../.env')
})

mongoose.connect(process.env.DATABASE_URL, {
  useMongoClient: true
})

const server = restify.createServer()
const port = process.env.PORT || 3000

server.use(restify.bodyParser())
server.use(restify.queryParser())
server.use(
  function crossOrigin (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    return next()
  }
)

routes(server)
cron()

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
