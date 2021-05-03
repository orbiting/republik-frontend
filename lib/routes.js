const nextRoutes = require('next-routes')
const routes = nextRoutes()

routes.matchPath = path => {
  const result = routes.match(path)
  if (result.route && result.route.name && result.params) {
    return {
      route: result.route.name,
      params: { ...result.query, ...result.params }
    }
  }
  return null
}

routes.cleanAsPath = asPath => asPath.split('?')[0].split('#')[0]
routes.questionnaireCrowdSlug = '1-minute'

//routes
//.add('index', '/')
//.add('signin', '/anmelden')
//.add('onboarding', '/einrichten', 'onboarding')
//.add('access', '/teilen')
//.add('account', '/konto')
//.add('cancel', '/abgang')
//.add('profile', '/~:slug')
// TEST FROM HERE
//.add('discussion', '/dialog')
//.add('crowdfunding', '/crowdfunding')
//.add('crowdfunding2', '/maerzkampagne')
//.add('cardGroups', '/wahltindaer')
//.add('cardSetup', '/wahltindaer/setup')
//.add('cardGroup', '/wahltindaer/:group/:suffix(diskussion|liste)?')
//.add('bookmarks', '/lesezeichen')
//.add('vote', '/vote/genossenschaft')
//.add('voteSubmit', '/vote/genossenschaft/kandidieren')
//.add('voteDiscuss', '/vote/genossenschaft/diskutieren')
//.add('vote201907', '/vote/juli19')
//.add('vote201907Discuss', '/vote/juli19/diskutieren')
//.add('vote201912', '/vote/dez19')
//.add('vote201912Discuss', '/vote/dez19/diskutieren')
//.add('votePage', '/vote/:slug/:suffix(diskutieren)?', 'article')
//.add('questionnaireCrowd', `/umfrage/:slug(${routes.questionnaireCrowdSlug})`)
//.add('questionnaire', '/umfrage/:slug')
//.add('events', '/veranstaltungen')
//.add('event', '/veranstaltung/:slug', 'events')
//.add('faq', '/faq')
//.add('feed', '/feed')
//.add('feuilleton', '/feuilleton')
//.add('search', '/suche')
//.add('sections', '/rubriken')
//.add('community', '/community')
//.add('en', '/en')
//.add('manifest', '/manifest')
//.add('markdown', '/markdown')
//.add('media', '/medien')
//.add('pledge', '/angebote')
//.add('claim', '/abholen')
//.add('cockpit19', '/cockpit19')
//.add('cockpit', '/cockpit')
//.add('updates', '/updates/:slug?')
//.add('notifications', '/mitteilung')
//.add('subscriptions', '/benachrichtigungen')
//.add('subscriptionsSettings', '/benachrichtigungen/einstellungen')
//.add('shareholder', '/aktionariat')
//.add('legal/imprint', '/impressum')
//.add('legal/privacy', '/datenschutz')
//.add('legal/tos', '/agb')
//.add('format', '/format/:slug', 'article')
//.add('dossier', '/dossier/:slug', 'article')
//.add(
//  'article',
//  '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/:suffix(diskussion)?'
//)
//.add('overview', '/:year(\\d{4})/:interval(wochen)?')
//.add('section', '/:slug', 'article')

module.exports = routes
