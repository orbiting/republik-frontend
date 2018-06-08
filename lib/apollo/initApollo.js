import ApolloClient from 'apollo-client'
import { ApolloLink, Observable } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

import fetch from 'isomorphic-unfetch'

import {API_URL, API_WS_URL, API_AUTHORIZATION_HEADER} from '../constants'
import { inNativeAppBrowser } from '../withInNativeApp'

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

const hasSubscriptionOperation = ({ query: { definitions } }) =>
  definitions.some(
    ({ kind, operation }) =>
      kind === 'OperationDefinition' && operation === 'subscription'
  )

let operationIds = 0

class AppLink extends ApolloLink {
  constructor () {
    super()
    this.callbacks = {}
    this.onMessage = this.onMessage.bind(this)
    this.postMessage = this.postMessage.bind(this)

    document.addEventListener('message', this.onMessage)
  }

  onMessage (event) {
    const operation = JSON.parse(event.data)
    const callback = this.callbacks[operation.id]

    if (callback) {
      callback(event.data)
    }
  }

  postMessage (operation) {
    return new Promise((resolve, reject) => {
      this.callbacks[operation.id] = result => {
        resolve(JSON.parse(result))
      }

      window.postMessage(JSON.stringify({
        type: 'graphql',
        data: operation
      }), '*')
    })
  }

  request (operation) {
    operation.id = operationIds++

    return new Observable(observer => {
      // Sends operation to be processed in app "worker"
      this.postMessage(operation).then(response => {
        observer.next(response)
        observer.complete()
      })
    })
  }
}

function create (initialState = {}, headers = {}) {
  const http = new HttpLink({
    uri: API_URL,
    credentials: 'include',
    headers: {
      cookie: headers.cookie,
      accept: headers.accept,
      Authorization: API_AUTHORIZATION_HEADER
    }
  })

  const link = process.browser
    ? ApolloLink.split(
      hasSubscriptionOperation,
      new WebSocketLink({
        uri: API_WS_URL,
        options: {
          reconnect: true,
          timeout: 50000
        }
      }),
      inNativeAppBrowser ? new AppLink() : http
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

  return apolloClient
}
