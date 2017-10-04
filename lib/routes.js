const nextRoutes = require('next-routes')
const routes = nextRoutes()

routes
  .add('index', '/')
  .add('me', '/me')
  .add('discussion', '/discussion')

module.exports = routes
