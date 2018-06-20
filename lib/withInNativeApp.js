import React from 'react'
import PropTypes from 'prop-types'

export const matchUserAgent = value => value && value.match(/RepublikApp/)

export const inNativeAppBrowser = process.browser && matchUserAgent(navigator.userAgent)

export const runInNativeAppBrowser = inNativeAppBrowser
  ? callback => callback()
  : () => {}

export const postMessage = msg => (
  window.postMessage(typeof msg === 'string' ? msg : JSON.stringify(msg), '*')
)

const nativeLog = (value) => {
  postMessage({ type: 'log', data: value })
}

export const log = inNativeAppBrowser ? nativeLog : console.log

const withInNativeApp = WrappedComponent => {
  class WithInNativeApp extends React.Component {
    render () {
      const headers = this.context.headers || {}

      return (
        <WrappedComponent
          inNativeApp={matchUserAgent(headers.userAgent)}
          {...this.props}
        />
      )
    }
  }

  WithInNativeApp.contextTypes = {
    headers: PropTypes.object
  }

  return WithInNativeApp
}

export default withInNativeApp
