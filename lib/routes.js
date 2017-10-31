const nextRoutes = require('next-routes')
const routes = nextRoutes()

routes
  .add('index', '/')
  .add('account', '/account')
  .add('profile', '/profile/:userId')
  .add('discussions', '/discussions')
  .add('discussion', '/discussion')

module.exports = routes
