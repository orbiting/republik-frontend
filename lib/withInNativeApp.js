import React from 'react'
import PropTypes from 'prop-types'
import withHeaders, { matchIOSUserAgent } from './withHeaders'
import { Router } from './routes'
import { parseJSONObject } from './safeJSON'

const matchUserAgent = value =>
  value && value.match(/RepublikApp\/([.0-9]+)/)?.[1]

export const inNativeAppBrowserAppVersion = process.browser
  ? matchUserAgent(navigator.userAgent)
  : undefined

export const inNativeAppBrowser = !!inNativeAppBrowserAppVersion

const runInNativeAppBrowser = inNativeAppBrowser
  ? callback => callback()
  : () => {}

runInNativeAppBrowser(() => {
  if (inNativeAppBrowserAppVersion >= 2) {
    return
  }
  const orgUrl =
    window.location.pathname + window.location.search + window.location.hash
  const orgTime = Date.now()
  // Accept push-route and scroll-to-top from app
  document.addEventListener('message', function(event) {
    const message = parseJSONObject(event.data)

    if (message.type === 'scroll-to-top') {
      window.scrollTo(0, 0)
    } else if (message.type === 'push-route') {
      // ignore push back loop from app
      // - while booting the app a bunch of race conditions lead to a loop
      // example
      // - save url on fs /feed
      // - app start loading webview with /feed
      // - deep services sets new url /rubriken
      // - app sends push-route /rubriken
      // - webview finishes loading, report /feed is now the url
      // - app saves /feed as url again
      // - app sends push-route /feed again <- this one we want to ignore
      if (message.url === orgUrl && Date.now() - orgTime < 10000) {
        return
      }
      Router.pushRoute(message.url).then(() => {
        window.scrollTo(0, 0)
      })
    }
  })

  // Monkey patch window.postMessage to fix native app webview issues
  // Ref: https://github.com/facebook/react-native/issues/11594
  let isReactNativePostMessageReady = !!window.originalPostMessage
  const queue = []

  let currentPostMessageFn = message => {
    queue.push(message)
  }

  if (!isReactNativePostMessageReady) {
    Object.defineProperty(window, 'postMessage', {
      configurable: true,
      enumerable: true,
      get() {
        return currentPostMessageFn
      },
      set(fn) {
        currentPostMessageFn = fn
        isReactNativePostMessageReady = true
        setTimeout(sendQueue, 0)
      }
    })
  }

  function sendQueue() {
    while (queue.length > 0) window.postMessage(queue.shift())
  }
})

export const postMessage = msg =>
  inNativeAppBrowser && inNativeAppBrowserAppVersion >= 2
    ? window.ReactNativeWebView.postMessage(
        typeof msg === 'string' ? msg : JSON.stringify(msg)
      )
    : window.postMessage(
        typeof msg === 'string' ? msg : JSON.stringify(msg),
        '*'
      )

const nativeLog = value => {
  postMessage({ type: 'log', data: value })
}

export const log = inNativeAppBrowser ? nativeLog : console.log

const withInNativeApp = WrappedComponent => {
  const WithInNativeApp = ({ headers, ...props }) => {
    const inNativeAppVersion = matchUserAgent(headers.userAgent)
    const inNativeApp = !!inNativeAppVersion
    const inIOS = matchIOSUserAgent(headers.userAgent)
    return (
      <WrappedComponent
        inNativeApp={inNativeApp}
        inNativeIOSApp={inNativeApp && inIOS}
        inNativeAppVersion={inNativeAppVersion}
        inIOS={inIOS}
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
