import test from 'tape'
import { getElementFromSeed } from './helpers'

test('helpers.getElementFromSeed', assert => {
  assert.equal(
    getElementFromSeed(['el-0', 'el-1', 'el-2', 'el-3', 'el-4'], 0.2),
    'el-1',
    'pick an element from a list'
  )
  assert.equal(
    getElementFromSeed(['el-0', 'el-1', 'el-2', 'el-3', 'el-4'], 0.6),
    'el-3',
    'pick an element from a list'
  )
  assert.equal(
    getElementFromSeed(['el-0'], 0.6),
    'el-0',
    'pick an element from a list'
  )
  assert.equal(
    getElementFromSeed(['el-0'], 0),
    'el-0',
    'pick an element from a list'
  )
  assert.equal(
    getElementFromSeed(['el-0'], 0.999),
    'el-0',
    'pick an element from a list'
  )
  assert.equal(
    getElementFromSeed(['el-0'], 1),
    undefined,
    'seed is expected to be 0 to 1, excluding 1'
  )
  assert.end()
})
