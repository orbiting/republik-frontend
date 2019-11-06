import 'core-js/fn/array/from'
import 'core-js/fn/array/fill'
import 'core-js/fn/array/find'
import 'core-js/fn/array/find-index'
import 'core-js/fn/array/includes'
import 'core-js/fn/object/assign'
import 'core-js/fn/object/entries'
import 'core-js/fn/object/values'
import 'core-js/fn/string/starts-with'
import 'core-js/es6/set'
import 'core-js/es6/map'
import 'core-js/es6/weak-map'
import 'core-js/es6/symbol'

// Workaround https://stackoverflow.com/questions/52390368
// Based on github.com/fanmingfei/array-reverse-ios12 by 明非
function buggyReverse() {
  const a = [1, 2]
  return String(a) === String(a.reverse())
}
if (buggyReverse()) {
  const originalReverse = Array.prototype.reverse
  // eslint-disable-next-line no-extend-native
  Array.prototype.reverse = function reverse() {
    if (Array.isArray(this)) this.length = this.length
    return originalReverse.call(this)
  }
}
