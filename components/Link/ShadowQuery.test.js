import test from 'tape'
import routes from '../../lib/routes'

// test assumptions about next-routes internals
test('routes.match', assert => {
  const path = '/2019/02/21/soundcheck'
  const result = routes.match('/2019/02/21/soundcheck')

  assert.ok(
    result && result.route,
    'article path matches and return a route'
  )
  assert.equal(
    result.route.getAs(result.params),
    path,
    'has getAs method'
  )
  assert.equal(
    result.route.getHref({ ...result.params, audio: 1 }),
    '/article?year=2019&month=02&day=21&slug=soundcheck&audio=1',
    'has getHref method'
  )
  assert.end()
})
