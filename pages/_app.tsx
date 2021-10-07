import '../lib/polyfill'

import React from 'react'
import { ApolloProvider, NormalizedCacheObject } from '@apollo/client'
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
import { APOLLO_STATE_PROP_NAME, useApollo } from '../lib/apollo/apolloClient'
import { AppProps } from 'next/app'

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event: ErrorEvent) => {
    const { message, filename, lineno, colno, error } = event
    reportError(
      'onerror',
      (error && error.stack) || [message, filename, lineno, colno].join('\n')
    )
  })

  window.addEventListener(
    'unhandledrejection',
    (event: PromiseRejectionEvent) => {
      reportError(
        'onunhandledrejection',
        (event.reason && event.reason.stack) || event.reason
      )
    }
  )
}

/**
 * Base PageProps that contains the apollo-cache utilized in SSG & SSR.
 */
export type BasePageProps<P = unknown> = {
  /**
   * Shared cache between the client and server
   */
  [APOLLO_STATE_PROP_NAME]?: NormalizedCacheObject
} & P // All other props given in a page

const WebApp = ({ Component, pageProps }: AppProps<BasePageProps>) => {
  const {
    // SSR only props
    providedApolloClient = undefined,
    headers = undefined,
    serverContext = undefined,
    ...otherPageProps
  } = pageProps
  const apolloClient = useApollo(otherPageProps, providedApolloClient)

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
                      <script
                        dangerouslySetInnerHTML={{
                          __html: `
 function handleLoggedInState(){const fuckOff=localStorage.getItem('persisted-me')
console.debug('persisted-me',fuckOff)
if(fuckOff){document.body.setAttribute('data-logged-in','true')}else{document.body.removeAttribute('data-logged-in')}}
if(typeof window!=='undefined'){window.addEventListener('storage',handleLoggedInState)}
document.addEventListener('DOMContentLoaded',handleLoggedInState)
                          `
                        }}
                      />
                    </Head>
                    <Component
                      serverContext={serverContext}
                      {...otherPageProps}
                    />
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
