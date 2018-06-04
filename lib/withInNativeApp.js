import React from 'react'
import { HttpHeaderContext } from './apollo/withData'

const matchUserAgent = value => value && value.match(/RepublikApp/)

export const runInApp = process.browser && matchUserAgent(navigator.userAgent)
  ? callback => callback()
  : () => {}

const withInNativeApp = WrappedComponent => props => {
  return (
    <HttpHeaderContext.Consumer>
      {headers => <WrappedComponent inNativeApp={matchUserAgent(headers.userAgent)} {...props} />}
    </HttpHeaderContext.Consumer>
  )
}

export default withInNativeApp
