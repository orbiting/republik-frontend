import test from 'tape'
import { matchPath, cleanAsPath } from './routes'

test('routes.matchPath', assert => {
  assert.deepEqual(
    matchPath('/2019/02/21/soundcheck'),
    { route: 'article', params: { year: '2019', month: '02', day: '21', slug: 'soundcheck' } },
    'detect article path'
  )
  assert.deepEqual(
    matchPath('/'),
    { route: 'index', params: {} },
    'detect index path'
  )
  assert.end()
})

test('routes.cleanAsPath', assert => {
  assert.equal(
    cleanAsPath('/2019/02/21/soundcheck?utm_source=newsletter'),
    '/2019/02/21/soundcheck',
    'rm query from article path'
  )
  assert.equal(
    cleanAsPath('/2018/10/18/cum-ex-files-lesehilfe#cumcum'),
    '/2018/10/18/cum-ex-files-lesehilfe',
    'rm hash from article path'
  )
  assert.equal(
    cleanAsPath('/?utm_source=newsletter'),
    '/',
    'rm query from index'
  )
  assert.end()
})
