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
  .add('crew', '/crew')
  .add('en', '/en')
  .add('manifest', '/manifest')
  .add('media', '/media')
  .add('pledge', '/pledge')
  .add('claim', '/claim')
  .add('legal/imprint', '/legal/imprint')
  .add('legal/privacy', '/legal/privacy')
  .add('legal/statute', '/legal/statute')
  .add('legal/tos', '/legal/tos')
  .add('article', '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug')

module.exports = routes
