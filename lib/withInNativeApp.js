import React from 'react'
import { HttpHeaderContext } from './apollo/withData'

export const matchUserAgent = value => value && value.match(/RepublikApp/)

export const runInApp = (appCallback, browserCallback) => {
  if (process.browser && matchUserAgent(navigator.userAgent)) {
    return appCallback()
  }

  if (browserCallback) {
    return browserCallback()
  }

  return null
}

const withInNativeApp = WrappedComponent => props => {
  return (
    <HttpHeaderContext.Consumer>
      {headers => <WrappedComponent inNativeApp={matchUserAgent(headers.userAgent)} {...props} />}
    </HttpHeaderContext.Consumer>
  )
}

export default withInNativeApp
