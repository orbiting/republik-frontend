import React from 'react'
import PropTypes from 'prop-types'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import initApollo from './initApollo'
import { Router } from '../../lib/routes'

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName (Component) {
  return Component.displayName || Component.name || 'Unknown'
}

// save headers in a global when receiving them in the browser
let savedHeaders

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
          const cookie = response.headers.get('Set-Cookie')
          if (cookie) {
            ctx.res.set('Set-Cookie', cookie)
          }
        })
        // Provide the `url` prop data in case a GraphQL query uses it
        const url = {
          query: ctx.query,
          pathname: ctx.pathname,
          asPath: ctx.asPath
        }

        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <ApolloProvider client={apollo}>
              <ComposedComponent url={url} {...composedInitialProps} serverContext={ctx} />
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
      // write headers to a global when the first page renders in the client
      // - browser only to ensure that it isn't shared between connections (which would be bad)
      if (process.browser && this.props.headers) {
        savedHeaders = this.props.headers
      }
    }

    componentDidMount () {
      // Make router accessible in a global way
      // Useful in app to redirect page client-side
      window.Router = Router
    }

    getChildContext () {
      return { headers: this.props.headers || savedHeaders }
    }

    render () {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
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

  WithData.childContextTypes = {
    headers: PropTypes.object
  }

  return WithData
}
