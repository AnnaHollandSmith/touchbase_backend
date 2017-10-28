import { homeControllers } from './controllers'

const routes = (server) => {
  server.get('/', homeControllers.main)
}

export default routes
