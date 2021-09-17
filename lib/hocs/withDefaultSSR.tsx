import React from 'react'
import {
  APOLLO_STATE_PROP_NAME,
  initializeApollo
} from '../apollo/apolloClient'
import { getDataFromTree } from '@apollo/client/react/ssr'
import { NextPage } from 'next'

function withDefaultSSR(Page: NextPage): NextPage {
  Page.getInitialProps = async ctx => {
    console.debug('Running getInitialProps')
    const { AppTree } = ctx
    const props = {}

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
    if (!process.browser) {
      const apolloClient = initializeApollo(null, {
        headers: ctx.req.headers,
        onResponse: response => {
          // headers.raw() is a node-fetch specific API and apparently the only way to get multiple cookies
          // https://github.com/bitinn/node-fetch/issues/251
          const cookies = response.headers.raw()['set-cookie']
          if (cookies) {
            ctx.res.setHeader('Set-Cookie', cookies)
          }
        }
      })
      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <AppTree
            pageProps={{
              providedApolloClient: apolloClient,
              headers: headers,
              serverContext: ctx
            }}
          />
        )
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error('Error while running `getDataFromTree`', error)
      }

      // Extract query data from the Apollo store
      console.debug(
        'Finished Walking of tree',
        JSON.stringify(apolloClient.cache.extract()).length
      )
      props[APOLLO_STATE_PROP_NAME] = apolloClient.cache.extract()
    }
    props['headers'] = headers

    console.debug('keys in props', Object.keys(props))

    return {
      pageProps: props
    }
  }

  return Page
}

export default withDefaultSSR
