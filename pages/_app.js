import App from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'

import { HeadersProvider } from '../lib/withHeaders'
import withApolloClient from '../lib/apollo/withApolloClient'
import { IconContext } from 'react-icons'
import Track from '../components/Track'

class WebApp extends App {
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
            <Component serverContext={serverContext} {...pageProps} />
            <Track />
          </IconContext.Provider>
        </HeadersProvider>
      </ApolloProvider>
    )
  }
}

export default withApolloClient(WebApp)
