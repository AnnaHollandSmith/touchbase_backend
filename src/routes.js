import { homeControllers, userControllers, journeyTimesController } from './controllers'

const routes = (server) => {
  server.get('/', homeControllers.main)

  server.post('/users', userControllers.create)

  server.get('/journeytimes', journeyTimesController.calculate)
}

export default routes
