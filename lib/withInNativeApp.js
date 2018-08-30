import React from 'react'
import PropTypes from 'prop-types'
import withHeaders from './withHeaders'
import { Router } from './routes'

export const matchUserAgent = value => value && !!value.match(/RepublikApp/)
const matchIOSUserAgent = value => value && !!value.match(/iPad|iPhone|iPod/)

export const inNativeAppBrowser = process.browser && !!matchUserAgent(navigator.userAgent)

export const runInNativeAppBrowser = inNativeAppBrowser
  ? callback => callback()
  : () => {}

runInNativeAppBrowser(() => {
  // Accept push-route and scroll-to-top from app
  document.addEventListener('message', function (event) {
    let message
    try {
      message = JSON.parse(event.data)
    } catch (error) {
      message = {}
    }

    if (message.type === 'scroll-to-top') {
      window.scrollTo(0, 0)
    } else if (message.type === 'push-route') {
      Router.pushRoute(message.url).then(() => {
        window.scrollTo(0, 0)
      })
    }
  })

  // Monkey patch window.postMessage to fix native app webview issues
  // Ref: https://github.com/facebook/react-native/issues/11594
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
  const WithInNativeApp = ({ headers, ...props }) => {
    const inNativeApp = matchUserAgent(headers.userAgent)
    return (
      <WrappedComponent
        inNativeApp={inNativeApp}
        inNativeIOSApp={inNativeApp && matchIOSUserAgent(headers.userAgent)}
        {...props}
      />
    )
  }

  WithInNativeApp.contextTypes = {
    headers: PropTypes.object
  }

  return withHeaders(WithInNativeApp)
}

export default withInNativeApp
