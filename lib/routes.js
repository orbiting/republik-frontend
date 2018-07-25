const nextRoutes = require('next-routes')
const routes = nextRoutes()

routes.matchPath = path => {
  const result = routes.match(path)
  if (result.route && result.route.name && result.params) {
    return {
      route: result.route.name,
      params: result.params
    }
  }
  return null
}

routes
  .add('index', '/')
  .add('signin', '/anmelden')
  .add('account', '/konto')
  .add('profile', '/~:slug')
  .add('discussion', '/diskussion')
  .add('events', '/veranstaltungen')
  .add('event', '/veranstaltung/:slug', 'events')
  .add('faq', '/faq')
  .add('feed', '/feed')
  .add('search', '/suche')
  .add('formats', '/rubriken')
  .add('community', '/community')
  .add('etiquette', '/etikette')
  .add('jobs', '/jobs')
  .add('researchBudget', '/etat')
  .add('en', '/en')
  .add('manifest', '/manifest')
  .add('markdown', '/markdown')
  .add('media', '/medien')
  .add('pledge', '/angebote')
  .add('claim', '/abholen')
  .add('updates', '/updates/:slug?')
  .add('notifications', '/mitteilung')
  .add('shareholder', '/aktionariat')
  .add('legal/imprint', '/impressum')
  .add('legal/privacy', '/datenschutz')
  .add('legal/statute', '/statuten')
  .add('legal/tos', '/agb')
  .add('format', '/format/:slug', 'article')
  .add('dossier', '/dossier/:slug', 'article')
  .add('article', '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/:suffix(diskussion)?')

module.exports = routes
