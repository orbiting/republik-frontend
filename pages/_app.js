import App, { Container } from 'next/app'
import React, { useEffect } from 'react'
import { ApolloProvider } from 'react-apollo'

import { HeadersProvider } from '../lib/withHeaders'
import withApolloClient from '../lib/apollo/withApolloClient'
import Track from '../components/Track'
import { DEFAULT_FONT_SIZE, useFontSize } from '../lib/fontSize'

const FontSizeSync = () => {
  const [fontSize] = useFontSize(DEFAULT_FONT_SIZE)
  useEffect(
    () => {
      document.documentElement.style.fontSize = fontSize + 'px'
    },
    [fontSize]
  )
  return null
}

class WebApp extends App {
  render () {
    const { Component, pageProps, apolloClient, headers, serverContext } = this.props
    return <Container>
      <FontSizeSync />
      <ApolloProvider client={apolloClient}>
        <HeadersProvider headers={headers}>
          <Component serverContext={serverContext} {...pageProps} />
          <Track />
        </HeadersProvider>
      </ApolloProvider>
    </Container>
  }
}

export default withApolloClient(WebApp)
