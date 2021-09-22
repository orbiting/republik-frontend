import React from 'react'
import {
  APOLLO_STATE_PROP_NAME,
  initializeApollo
} from '../apollo/apolloClient'
import { getDataFromTree } from '@apollo/client/react/ssr'
import { NextPage, NextPageContext } from 'next'
import { BasePageProps } from '../../pages/_app'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

/**
 * Default Props used when rendering a page using SSR
 */
type DefaultSSRPageProps<P = unknown> = BasePageProps<P> & {
  /**
   * Provided ApolloClient used to populate the cache on when doing SSR
   */
  providedApolloClient?: ApolloClient<NormalizedCacheObject>
  /**
   * Request headers
   */
  headers?: {
    accept: string
    userAgent: string
  }
  /**
   * NextPageContext available during SSR
   */
  ctx?: NextPageContext
}

/**
 * HOC that adds a default getInitialProps method to the page-component.
 * The getInitialProps method traverses the Document-Tree during SSR and
 * runs all GraphQL queries (for the logged in user).
 * @param Page
 */
function withDefaultSSR(
  Page: NextPage<DefaultSSRPageProps>
): NextPage<DefaultSSRPageProps> {
  // If the page component already has a getInitialProps method make sure to run it.
  const originalGetInitialProps = Page.getInitialProps ?? undefined

  async function getInitialProps(
    ctx: NextPageContext
  ): Promise<DefaultSSRPageProps> {
    const { AppTree } = ctx
    let props: DefaultSSRPageProps<Record<string, unknown>> = {}
    if (originalGetInitialProps) {
      props = await originalGetInitialProps(ctx)
    }

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    if (!process.browser) {
      // We forward the accept header for webp detection
      // - never forward cookie to client!
      const headers = !process.browser
        ? {
            accept: ctx.req.headers.accept,
            userAgent: ctx.req.headers['user-agent']
          }
        : undefined

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
        // Run all GraphQL queries with a provided apolloClient
        await getDataFromTree(
          <AppTree
            pageProps={{
              providedApolloClient: apolloClient,
              headers: headers,
              serverContext: ctx,
              ...props
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
      props[APOLLO_STATE_PROP_NAME] = apolloClient.cache.extract()
    }

    return props
  }

  Page.getInitialProps = getInitialProps

  return Page
}

export default withDefaultSSR

// TODO: Fix handling when
