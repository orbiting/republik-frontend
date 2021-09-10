import { useMemo } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createLink } from './initApollo'
import deepMerge from '../deepMerge'
import {
  inNativeAppBrowser,
  inNativeAppBrowserLegacy,
  postMessage
} from '../withInNativeApp'
import { meQuery } from './withMe'

const isDev = process.env.NODE_ENV && process.env.NODE_ENV === 'development'

// Based on the with-apollo example inside the Next.js repository
// Source: https://github.com/vercel/next.js/blob/canary/examples/with-apollo/lib/apolloClient.js

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient

function createApolloClient(options = {}) {
  return new ApolloClient({
    connectToDevTools: process.browser && isDev,
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    link: createLink(options.link ?? undefined, options.onResponse ?? undefined)
  })
}

/**
 * Initialize an Apollo Client. On the client the Apollo Client is shared across
 * the whole application and on the server a new instance is generated with each execution.
 * @param initialCache preexisting Apollo Client cache that should be used
 * to hydrate the newly created Apollo Client instance.
 * @param options
 * @returns {ApolloClient<unknown>|ApolloClient<any>}
 */
export function initializeApollo(initialCache = null, options = {}) {
  const _apolloClient = apolloClient ?? createApolloClient(options)

  if (initialCache) {
    const existingCache = _apolloClient.cache.extract()
    const mergedCache = deepMerge({}, initialCache, existingCache)
    _apolloClient.cache.restore(mergedCache)
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  if (inNativeAppBrowser) {
    try {
      // Post current user data to native app
      const data = apolloClient.readQuery({ query: meQuery })
      if (inNativeAppBrowserLegacy) {
        postMessage({ type: 'initial-state', payload: data })
      } else {
        postMessage({ type: 'isSignedIn', payload: !!data?.me })
      }
    } catch (e) {
      // readQuery throws if no me query is in the cache
      postMessage({
        type: 'warning',
        data: {
          error: 'me not available on page load'
        }
      })
    }
  }

  return apolloClient
}

/**
 * Write the apollo-cache to the pageProps to allow the client
 * to use the apollo-cache from the SSG/SSR process
 * @param client Apollo Client that will pass it's cache to the client
 * @param pageProps
 */
export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }
}

/**
 * Hook to retrieve an Apollo Client instance.
 * The pageProps may contain the Apollo Client, that was generated
 * during the rendering process on the server (SSG/SSR).
 * If the cache from the server is present the Apollo Client in the browser
 * will reuse the existing cache.
 *
 * @param pageProps
 * @returns {ApolloClient<unknown>|ApolloClient<any>}
 */
export function useApollo(pageProps) {
  const apolloCache = pageProps ? pageProps[APOLLO_STATE_PROP_NAME] : null
  return useMemo(() => initializeApollo(apolloCache), [apolloCache])
}
