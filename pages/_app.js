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
import {
  APOLLO_STATE_PROP_NAME,
  initializeApollo,
  useApollo
} from '../lib/apollo/apolloClient'
import { getDataFromTree } from '@apollo/client/react/ssr'

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

const WebApp = ({
  Component,
  pageProps,
  headers,
  serverContext,
  // During SSR
  apolloClient: providedApolloClient
}) => {
  console.log(
    'apollo-state present in pageProps',
    pageProps ? pageProps[APOLLO_STATE_PROP_NAME] !== {} : false
  )
  const apolloClient = providedApolloClient ?? useApollo(pageProps)

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

WebApp.getInitialProps = async appCtx => {
  const { ctx, AppTree } = appCtx
  let props = {}

  // We forward the accept header for webp detection
  // - never forward cookie to client!
  const headers = !process.browser
    ? {
        accept: ctx.req.headers.accept,
        userAgent: ctx.req.headers['user-agent']
      }
    : undefined

  // Run all GraphQL queries in the component tree
  // and extract the resulting data
  let apolloCache
  if (!process.browser) {
    /*const apollo = initApollo(undefined, ctx.req.headers, response => {
      // headers.raw() is a node-fetch specific API and apparently the only way to get multiple cookies
      // https://github.com/bitinn/node-fetch/issues/251
      const cookies = response.headers.raw()['set-cookie']
      if (cookies) {
        ctx.res.set('Set-Cookie', cookies)
      }
    })*/
    const apolloClient = initializeApollo(null, {
      headers: ctx.req.headers,
      onResponse: response => {
        // headers.raw() is a node-fetch specific API and apparently the only way to get multiple cookies
        // https://github.com/bitinn/node-fetch/issues/251
        const cookies = response.headers.raw()['set-cookie']
        if (cookies) {
          ctx.res.set('Set-Cookie', cookies)
        }
      }
    })
    try {
      // Run all GraphQL queries
      await getDataFromTree(
        <AppTree
          apolloClient={apolloClient}
          headers={headers}
          serverContext={ctx}
        />
      )
    } catch (error) {
      // Prevent Apollo Client GraphQL errors from crashing SSR.
      // Handle them in components via the data.error prop:
      // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
      console.error('Error while running `getDataFromTree`', error)
    }

    // getDataFromTree does not call componentWillUnmount
    // head side effect therefore need to be cleared manually
    Head.rewind()

    // Extract query data from the Apollo store
    apolloCache = apolloClient.cache.extract()
    props[APOLLO_STATE_PROP_NAME] = apolloCache
    //console.debug('getInitialProps cache state', apolloCache)
  }

  return {
    pageProps: props,
    headers
  }
}
