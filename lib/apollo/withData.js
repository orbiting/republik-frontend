import React from 'react'
import PropTypes from 'prop-types'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import initApollo from './initApollo'
import { HeadersProvider } from '../../lib/withHeaders'

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName (Component) {
  return Component.displayName || Component.name || 'Unknown'
}

export default ComposedComponent => {
  class WithData extends React.Component {
    static async getInitialProps (ctx) {
      let serverState = {}

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {}
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx)
      }

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
        // Server-side we initialize a fresh apollo with all headers (including cookie)
        // and forward cookies from backend responses to the user
        const apollo = initApollo(undefined, ctx.req.headers, response => {
          // headers.raw() is a node-fetch specific API and apparently the only way to get multiple cookies
          // https://github.com/bitinn/node-fetch/issues/251
          const cookies = response.headers.raw()['set-cookie']
          if (cookies) {
            ctx.res.set('Set-Cookie', cookies)
          }
        })

        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <ApolloProvider client={apollo}>
              <HeadersProvider headers={headers}>
                <ComposedComponent {...composedInitialProps} serverContext={ctx} />
              </HeadersProvider>
            </ApolloProvider>
          )
        } catch (error) {
          console.log(error)
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        }

        serverState = apollo.cache.extract()
      }

      return {
        serverState,
        headers,
        ...composedInitialProps
      }
    }

    constructor (props) {
      super(props)
      this.apollo = initApollo(
        this.props.serverState,
        this.props.headers
      )
    }

    render () {
      return (
        <ApolloProvider client={this.apollo}>
          <HeadersProvider headers={this.props.headers}>
            <ComposedComponent {...this.props} />
          </HeadersProvider>
        </ApolloProvider>
      )
    }
  }

  WithData.displayName = `WithData(${getComponentDisplayName(
    ComposedComponent
  )})`

  WithData.propTypes = {
    serverState: PropTypes.object.isRequired
  }

  return WithData
}
