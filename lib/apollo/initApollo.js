import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory'

import fetch from 'isomorphic-unfetch'

import {
  API_URL,
  API_WS_URL,
  API_AUTHORIZATION_HEADER,
  SSR_API_URL
} from '../constants'
import {
  postMessage,
  inNativeAppBrowser,
  inNativeAppBrowserAppVersion
} from '../withInNativeApp'
import { createAppWorkerLink, hasSubscriptionOperation } from './appWorkerLink'
import { meQuery } from './withMe'

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
        },
        {
          kind: 'INTERFACE',
          name: 'QuestionInterface',
          possibleTypes: [
            {
              name: 'QuestionTypeText'
            },
            {
              name: 'QuestionTypeChoice'
            },
            {
              name: 'QuestionTypeRange'
            },
            {
              name: 'QuestionTypeDocument'
            }
          ]
        },
        {
          kind: 'INTERFACE',
          name: 'PlayableMedia',
          possibleTypes: [
            {
              name: 'AudioSource'
            },
            {
              name: 'VimeoEmbed'
            },
            {
              name: 'YoutubeEmbed'
            }
          ]
        }
      ]
    }
  }
})

const withResponseInterceptor = ({ onResponse }) =>
  new ApolloLink((operation, forward) => {
    return forward(operation).map(result => {
      const context = operation.getContext()
      if (context.response) {
        onResponse(context.response)
      }
      return result
    })
  })

const createLink = (headers = {}, onResponse = () => {}) => {
  if (inNativeAppBrowser && inNativeAppBrowserAppVersion < '2') {
    return createAppWorkerLink()
  }
  const http = new HttpLink({
    uri: process.browser ? API_URL : SSR_API_URL,
    credentials: 'include',
    headers: {
      cookie: headers.cookie,
      accept: headers.accept,
      Authorization: API_AUTHORIZATION_HEADER
    }
  })
  if (process.browser) {
    return ApolloLink.split(
      hasSubscriptionOperation,
      new WebSocketLink({
        uri: API_WS_URL,
        options: {
          lazy: true,
          reconnect: true,
          timeout: 50000
        }
      }),
      http
    )
  }
  // Link used for SSR
  return ApolloLink.from([
    withResponseInterceptor({
      onResponse
    }),
    http
  ])
}

function create(initialState = {}, headers = {}, onResponse) {
  const link = createLink(headers, onResponse)

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

let globalApolloClient = null

export default function initApollo(initialState, headers, onResponse) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, headers, onResponse)
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = create(initialState, headers, onResponse)

    if (inNativeAppBrowser) {
      try {
        // Post current user data to native app
        const data = globalApolloClient.readQuery({ query: meQuery })
        postMessage({ type: 'initial-state', payload: data })
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
  }

  return globalApolloClient
}
