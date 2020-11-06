import App from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import Head from 'next/head'

import { reportError } from '../lib/errors'
import { HeadersProvider } from '../lib/withHeaders'
import withApolloClient from '../lib/apollo/withApolloClient'
import { IconContext } from 'react-icons'
import Track from '../components/Track'
import AudioProvider from '../components/Audio'
import AudioPlayer from '../components/Audio/AudioPlayer'
import AppVariableContext from '../components/Article/AppVariableContext'

if (typeof window !== 'undefined') {
  const prevErrorHandler = window.onerror
  window.onerror = (...args) => {
    prevErrorHandler && prevErrorHandler(...args)
    const [msg, url, lineNo, columnNo, error] = args
    reportError(
      'onerror',
      (error && error.stack) || [msg, url, lineNo, columnNo].join('\n')
    )
  }
  const prevRejectionHandler = window.onunhandledrejection
  window.onunhandledrejection = (...args) => {
    prevRejectionHandler && prevRejectionHandler(...args)
    const [event] = args
    reportError(
      'onunhandledrejection',
      (event.reason && event.reason.stack) || event.reason
    )
  }
}

class WebApp extends App {
  componentDidCatch(error, info) {
    reportError(
      'componentDidCatch',
      `${error}${info.componentStack}\n${error && error.stack}`
    )
  }
  render() {
    const {
      Component,
      pageProps,
      apolloClient,
      headers,
      serverContext
    } = this.props
    return (
      <ApolloProvider client={apolloClient}>
        <HeadersProvider headers={headers}>
          <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
            <AudioProvider>
              <AppVariableContext>
                <Head>
                  <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                  />
                </Head>
                <Component serverContext={serverContext} {...pageProps} />
                <Track />
                <AudioPlayer />
              </AppVariableContext>
            </AudioProvider>
          </IconContext.Provider>
        </HeadersProvider>
      </ApolloProvider>
    )
  }
}

export default withApolloClient(WebApp)
