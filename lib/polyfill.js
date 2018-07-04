import 'core-js/fn/array/from'
import 'core-js/fn/array/find'
import 'core-js/fn/array/find-index'
import 'core-js/fn/array/includes'
import 'core-js/fn/object/assign'
import 'core-js/fn/string/starts-with'
import 'core-js/es6/set'
import 'core-js/es6/map'
import 'core-js/es6/weak-map'
import { runInNativeAppBrowser } from './withInNativeApp'

// Polyfill window.postMessage to fix native app webview issues
// Ref: https://github.com/facebook/react-native/issues/11594
const awaitPostMessage = () => {
  let isReactNativePostMessageReady = !!window.originalPostMessage
  const queue = []

  let currentPostMessageFn = (message) => {
    if (queue.length > 100) queue.shift()
    queue.push(message)
  }

  if (!isReactNativePostMessageReady) {
    Object.defineProperty(window, 'postMessage', {
      configurable: true,
      enumerable: true,
      get () {
        return currentPostMessageFn
      },
      set (fn) {
        currentPostMessageFn = fn
        isReactNativePostMessageReady = true
        setTimeout(sendQueue, 0)
      }
    })
  }

  function sendQueue () {
    while (queue.length > 0) window.postMessage(queue.shift())
  }
}

// Enable only for native app
runInNativeAppBrowser(awaitPostMessage)
