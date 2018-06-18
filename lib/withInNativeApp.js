import React from 'react'
import { HttpHeaderContext } from './apollo/withData'

export const matchUserAgent = value => value && value.match(/RepublikApp/)

export const inNativeAppBrowser = process.browser && matchUserAgent(navigator.userAgent)

export const runInNativeAppBrowser = inNativeAppBrowser
  ? callback => callback()
  : () => {}

const nativeLog = (value) => {
  window.postMessage(JSON.stringify({
    type: 'log',
    data: value
  }), '*')
}

export const log = inNativeAppBrowser ? nativeLog : console.log

const withInNativeApp = WrappedComponent => props => {
  return (
    <HttpHeaderContext.Consumer>
      {headers => <WrappedComponent inNativeApp={matchUserAgent(headers.userAgent)} {...props} />}
    </HttpHeaderContext.Consumer>
  )
}

export default withInNativeApp
