import { ApolloLink, Observable } from 'apollo-link'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { API_WS_URL } from '../constants'

export const hasSubscriptionOperation = ({ query: { definitions } }) => (
  definitions.some(
    ({ kind, operation }) =>
      kind === 'OperationDefinition' && operation === 'subscription'
  )
)

// WebSocket compliant interface to handle subscriptions via app worker
class WorkerInterface {
  constructor (url, protocol) {
    this.url = url
    this.protocol = protocol
    this.readyState = WorkerInterface.OPEN
  }

  send (serializedMessage) {
    window.postMessage(serializedMessage, '*')
  }

  set onmessage (fn) {
    document.addEventListener('message', ({ data }) => {
      const d = JSON.parse(data)

      if (d.type === 'start' || d.type === 'data') {
        fn({ data })
      }
    })
  }
}

WorkerInterface.CLOSED = 'CLOSED'
WorkerInterface.OPEN = 'OPEN'
WorkerInterface.CONNECTING = 'CONNECTING'

// Keep track of queries and mutations
let operationIds = 0

// Apollo link implementation to resolve queries and mutations via app worker
class PromiseWorkerLink extends ApolloLink {
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
      callback(operation)
    }
  }

  postMessage (id, operation) {
    return new Promise((resolve, reject) => {
      this.callbacks[id] = result => {
        resolve(result)
      }

      window.postMessage(JSON.stringify({
        type: 'graphql',
        data: {
          id,
          payload: operation
        }
      }), '*')
    })
  }

  request (operation) {
    const id = operationIds++

    return new Observable(observer => {
      // Sends operation to be processed in app "worker"
      this.postMessage(id, operation).then(response => {
        observer.next(response)
        observer.complete()
      })
    })
  }
}

// Apollo link implementation to resolve subscriptions via app worker
class SubscriptionWorkerLink extends ApolloLink {
  constructor ({ uri, options }) {
    super()
    this.subscriptionClient = new SubscriptionClient(uri, options, WorkerInterface)
  }

  request (operation) {
    return this.subscriptionClient.request(operation)
  }
}

// Create app worker link instance
// Uses both promise or subscription links based on operation type
export const createAppWorkerLink = () => {
  const promiseWorkerLink = new PromiseWorkerLink()
  const subscriptionWorkerLink = new SubscriptionWorkerLink({
    uri: API_WS_URL,
    options: {
      reconnect: true,
      timeout: 50000
    }
  })

  return ApolloLink.split(
    hasSubscriptionOperation,
    subscriptionWorkerLink,
    promiseWorkerLink
  )
}
