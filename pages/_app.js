import '../lib/polyfill'

import React from 'react'
import { ApolloProvider } from '@apollo/client'
import Head from 'next/head'

import { ColorContextProvider } from '@project-r/styleguide'
import { IconContextProvider } from '@project-r/styleguide/icons'

import { ErrorBoundary, reportError } from '../lib/errors'
import { HeadersProvider } from '../lib/withHeaders'
import Track from '../components/Track'
import MessageSync from '../components/NativeApp/MessageSync'
import AudioProvider from '../components/Audio/AudioProvider'
import AudioPlayer from '../components/Audio/AudioPlayer'
import MediaProgressContext from '../components/Audio/MediaProgress'
import AppVariableContext from '../components/Article/AppVariableContext'
import ColorSchemeSync from '../components/ColorScheme/Sync'
import { useApollo } from '../lib/apollo/apolloClient'

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

const WebApp = ({ Component, pageProps, headers, serverContext }) => {
  const apolloClient = useApollo()

  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <HeadersProvider headers={headers}>
          <MediaProgressContext>
            <IconContextProvider value={{ style: { verticalAlign: 'middle' } }}>
              <AudioProvider>
                <AppVariableContext>
                  <ColorContextProvider root colorSchemeKey='auto'>
                    <ColorSchemeSync />
                    <Head>
                      <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1'
                      />
                    </Head>
                    <Component serverContext={serverContext} {...pageProps} />
                    <Track />
                    <AudioPlayer />
                    <MessageSync />
                  </ColorContextProvider>
                </AppVariableContext>
              </AudioProvider>
            </IconContextProvider>
          </MediaProgressContext>
        </HeadersProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}

export default WebApp
