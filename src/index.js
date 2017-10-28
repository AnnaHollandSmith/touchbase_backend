import restify from 'restify'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import routes from './routes'

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

routes(server)

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
