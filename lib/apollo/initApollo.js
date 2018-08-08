import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

import fetch from 'isomorphic-unfetch'

import { API_URL, API_WS_URL, API_AUTHORIZATION_HEADER, SSR_API_URL } from '../constants'
import { postMessage, inNativeAppBrowser } from '../withInNativeApp'
import { createAppWorkerLink, hasSubscriptionOperation } from './appWorkerLink'
import { meQuery } from './withMe'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

export const dataIdFromObject = object => {
  if (object.__typename) {
    if (object.id !== undefined) {
      return `${object.__typename}:${object.id}`
    }
    if (object._id !== undefined) {
      return `${object.__typename}:${object._id}`
    }
  }
  return null
}

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'UNION',
          name: 'Reward',
          possibleTypes: [
            {
              name: 'Goodie'
            },
            {
              name: 'MembershipType'
            }
          ]
        }
      ]
    }
  }
})

function create (initialState = {}, headers = {}) {
  const http = new HttpLink({
    uri: process.browser ? API_URL : SSR_API_URL,
    credentials: 'include',
    headers: {
      cookie: headers.cookie,
      accept: headers.accept,
      Authorization: API_AUTHORIZATION_HEADER
    }
  })

  const link = process.browser
    ? inNativeAppBrowser
      ? createAppWorkerLink()
      : ApolloLink.split(
        hasSubscriptionOperation,
        new WebSocketLink({
          uri: API_WS_URL,
          options: {
            reconnect: true,
            timeout: 50000
          }
        }),
        http
      )
    : http

  return new ApolloClient({
    connectToDevTools: process.browser,
    cache: new InMemoryCache({
      fragmentMatcher,
      dataIdFromObject
    }).restore(initialState || {}),
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link
  })
}

export default function initApollo (initialState, headers) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, headers)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, headers)
  }

  // Post current user data to native app
  // When app loading client side, initialState is empty and should not be posted
  if (Object.keys(initialState).length !== 0) {
    const data = apolloClient.readQuery({ query: meQuery })
    postMessage({ type: 'initial-state', payload: data })
  }

  return apolloClient
}
