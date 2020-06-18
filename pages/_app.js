import App from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'

import { HeadersProvider } from '../lib/withHeaders'
import withApolloClient from '../lib/apollo/withApolloClient'
import { IconContext } from 'react-icons'
import Track from '../components/Track'
import AudioProvider from '../components/Audio'

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
            <AudioProvider>
              <Component serverContext={serverContext} {...pageProps} />
              <Track />
            </AudioProvider>
          </IconContext.Provider>
        </HeadersProvider>
      </ApolloProvider>
    )
  }
}

export default withApolloClient(WebApp)
