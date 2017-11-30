const nextRoutes = require('next-routes')
const routes = nextRoutes()

routes
  .add('index', '/')
  .add('account', '/account')
  .add('profile', '/~:userId')
  .add('discussions', '/discussions')
  .add('discussion', '/discussion')
  .add('feed', '/feed')
  .add('community', '/community')
  .add('article', '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug')

module.exports = routes
