import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import StatusError from '../StatusError'

import createFrontSchema from '@project-r/styleguide/lib/templates/Front'

import withT from '../../lib/withT'
import Loader from '../Loader'
import Link from '../Link/Href'
import SSRCachingBoundary from '../SSRCachingBoundary'

import { renderMdast } from 'mdast-react-render'

const schema = createFrontSchema({
  Link
})

const getDocument = gql`
  query getFront($path: String!) {
    front: document(path: $path) {
      id
      content
      meta {
        path
        title
        description
        image
        facebookDescription
        facebookImage
        facebookTitle
        twitterDescription
        twitterImage
        twitterTitle
      }
    }
  }
`

class PreviewFront extends Component {
  render () {
    const { url, data, data: { front }, t } = this.props

    return (
      <Loader loading={data.loading} error={data.error} message={t('pages/magazine/title')} render={() => {
        if (!front) {
          return <StatusError
            url={url}
            statusCode={404}
            serverContext={this.props.serverContext} />
        }

        return (
          <SSRCachingBoundary key='content' cacheKey={front.id}>
            {() => renderMdast(front.content, schema)}
          </SSRCachingBoundary>
        )
      }} />
    )
  }
}

export default compose(
  withT,
  graphql(getDocument, {
    options: () => ({
      variables: {
        path: '/preview-front'
      }
    }),
    props: ({data, ownProps: {serverContext}}) => {
      if (serverContext && !data.error && !data.loading && !data.front) {
        serverContext.res.statusCode = 503
      }

      return {
        data
      }
    }
  })
)(PreviewFront)
