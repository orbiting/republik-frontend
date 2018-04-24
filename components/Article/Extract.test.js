import test from 'tape'

import { parseSliceRanges } from './Extract'

test('parseSliceRanges.index', assert => {
  assert.deepEqual(
    parseSliceRanges('0'),
    [[0, 1]],
    'one level'
  )
  assert.deepEqual(
    parseSliceRanges('0:0'),
    [[0, 1], [0, 1]],
    'two levels'
  )
  assert.end()
})

test('parseSliceRanges.range', assert => {
  assert.deepEqual(
    parseSliceRanges('0...2'),
    [[0, 2]],
    'single level'
  )
  assert.deepEqual(
    parseSliceRanges('0...2:0...3'),
    [[0, 2], [0, 3]],
    'two levels'
  )
  assert.deepEqual(
    parseSliceRanges('...2:...3'),
    [[0, 2], [0, 3]],
    'fill zero'
  )
  assert.deepEqual(
    parseSliceRanges('0:2...'),
    [[0, 1], [2, undefined]],
    'without end'
  )
  assert.end()
})
