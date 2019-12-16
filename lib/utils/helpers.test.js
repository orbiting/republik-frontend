import test from 'tape'
import { normalise, getElementFromSeed } from './helpers'

test('normalise.getElementFromSeed', assert => {
  assert.equal(
    normalise(2, 8, 4),
    1,
    'transpose value from [0, oldMax] to [0, newMax]'
  )
  assert.end()
})

test('helpers.getElementFromSeed', assert => {
  assert.equal(
    getElementFromSeed(['el-0', 'el-1', 'el-2', 'el-3', 'el-4'], 2, 8),
    'el-1',
    'use helpers.normalise to pick an element from a list'
  )
  assert.end()
})
