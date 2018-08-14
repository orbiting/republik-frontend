import React from 'react'
import PropTypes from 'prop-types'
import withHeaders from './withHeaders'

export const matchUserAgent = value => value && !!value.match(/RepublikApp/)

export const inNativeAppBrowser = process.browser && !!matchUserAgent(navigator.userAgent)

export const runInNativeAppBrowser = inNativeAppBrowser
  ? callback => callback()
  : () => {}

// Monkey patch window.postMessage to fix native app webview issues
// Ref: https://github.com/facebook/react-native/issues/11594
runInNativeAppBrowser(() => {
  let isReactNativePostMessageReady = !!window.originalPostMessage
  const queue = []

  let currentPostMessageFn = (message) => {
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
})

export const postMessage = msg => (
  inNativeAppBrowser && window.postMessage(typeof msg === 'string' ? msg : JSON.stringify(msg), '*')
)

const nativeLog = (value) => {
  postMessage({ type: 'log', data: value })
}

export const log = inNativeAppBrowser ? nativeLog : console.log

const withInNativeApp = WrappedComponent => {
  const WithInNativeApp = ({ headers, ...props }) => (
    <WrappedComponent
      inNativeApp={matchUserAgent(headers.userAgent) || inNativeAppBrowser}
      {...props}
    />
  )

  WithInNativeApp.contextTypes = {
    headers: PropTypes.object
  }

  return withHeaders(WithInNativeApp)
}

export default withInNativeApp
