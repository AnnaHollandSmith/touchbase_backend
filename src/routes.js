import {
  homeControllers,
  userControllers,
  journeyTimeControllers,
  journeyControllers,
  messageControllers
} from './controllers'

const routes = (server) => {
  server.get('/', homeControllers.main)

  server.post('/users', userControllers.create)

  server.get('/users/:mobileNumber', userControllers.single)

  server.get('/journeytimes/', journeyTimeControllers.calculate)

  server.post('/journeys', journeyControllers.create)

  server.post('/receivemessage/', messageControllers.receive)
}

export default routes
