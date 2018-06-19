import React from 'react'
import PropTypes from 'prop-types'

export const matchUserAgent = value => value && value.match(/RepublikApp/)

export const inNativeAppBrowser = process.browser && matchUserAgent(navigator.userAgent)

export const runInNativeAppBrowser = inNativeAppBrowser
  ? callback => callback()
  : () => {
    window.postMessage(JSON.stringify({
      type: 'log',
      data: 'Oops'
    }), '*')
  }

const nativeLog = (value) => {
  window.postMessage(JSON.stringify({
    type: 'log',
    data: value
  }), '*')
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
