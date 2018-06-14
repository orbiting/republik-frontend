import test from 'tape'
import {
  deserializeFilters,
  serializeFilters,
  deserializeSort,
  serializeSort
} from './serialize'

const filters = [
  {
    title: 'one filter',
    deserialized: [
      {
        key: 'template',
        value: 'article'
      }
    ],
    serialized: 'template%3Aarticle'
  },
  {
    title: 'two filters',
    deserialized: [
      {
        key: 'template',
        value: 'article'
      },
      {
        key: 'hasVideo',
        value: 'true'
      }
    ],
    serialized: 'template%3Aarticle%7ChasVideo%3Atrue'
  }
]

filters.forEach(({ title, deserialized, serialized }) => {
  test(`(de)serializeFilters is reversible with ${title}`, assert => {
    const serializedFilters = serializeFilters(deserialized)
    assert.equal(serializedFilters, serialized)
    assert.deepEqual(deserializeFilters(serializedFilters), deserialized)
    assert.end()
  })
})

test('serializeFilters removes unsupported filter', assert => {
  assert.equal(
    serializeFilters([
      {
        key: 'unsupported',
        value: 'foo'
      },
      {
        key: 'template',
        value: 'article'
      },
      {
        key: 'hasVideo',
        value: 'true'
      }
    ]),
    'template%3Aarticle%7ChasVideo%3Atrue'
  )
  assert.end()
})

test('deserializeFilters removes unsupported filter', assert => {
  assert.deepEqual(
    deserializeFilters(
      'unsupported%3Afoo%7Ctemplate%3Aarticle%7ChasVideo%3Atrue'
    ),
    [
      {
        key: 'template',
        value: 'article'
      },
      {
        key: 'hasVideo',
        value: 'true'
      }
    ]
  )
  assert.end()
})

const sort = [
  {
    title: 'key only',
    deserialized: {
      key: 'relevance'
    },
    serialized: 'relevance%3A'
  },
  {
    title: 'key and direction',
    deserialized: {
      key: 'publishedAt',
      direction: 'ASC'
    },
    serialized: 'publishedAt%3AASC'
  }
]

sort.forEach(({ title, deserialized, serialized }) => {
  test(`(de)serializeSort is reversible with ${title}`, assert => {
    const serializedSort = serializeSort(deserialized)
    assert.equal(serializedSort, serialized)
    assert.deepEqual(deserializeSort(serializedSort), deserialized)
    assert.end()
  })
})

test(`serializeSort removes unsupported sort`, assert => {
  assert.equal(
    serializeSort({
      key: 'unsupported'
    }),
    undefined
  )
  assert.end()
})

test(`deserializeSort removes unsupported sort`, assert => {
  assert.deepEqual(deserializeSort('unsupported%3AASC'), undefined)
  assert.end()
})
