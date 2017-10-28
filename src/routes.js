import { homeControllers, userControllers } from './controllers'

const routes = (server) => {
  server.get('/', homeControllers.main)

  server.post('/users', userControllers.create)
}

export default routes
