import { useMemo } from 'react'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

// Based on the with-apollo example inside the Next.js repository
// Source: https://github.com/vercel/next.js/blob/canary/examples/with-apollo/lib/apolloClient.js

let apolloClient

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: '', // TODO:
      credentials: 'same-origin'
    })
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  if (initialState) {
    _apolloClient.cache.restore(initialState)
  }

  // On the server a new apollo client is created for each use
  // This prevents the cache from being shared between requests
  if (typeof window === 'undefined') return _apolloClient

  apolloClient = apolloClient ?? _apolloClient

  return apolloClient
}

/**
 * Return a memoized apollo-client
 * @param initialState cache shared between the client and server
 */
export function useApollo(initialState) {
  return useMemo(() => initializeApollo((initialState = null)), [initialState])
}
