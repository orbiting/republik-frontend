import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import { InlineSpinner } from '@project-r/styleguide'
import { withRouter } from 'next/router'
import StatusError from '../StatusError'

import createFrontSchema from '@project-r/styleguide/lib/templates/Front'
import InfiniteScroll from 'react-infinite-scroller'

import withT from '../../lib/withT'
import Loader from '../Loader'
import Frame from '../Frame'
import Link from '../Link/Href'
import SSRCachingBoundary from '../SSRCachingBoundary'

import { renderMdast } from 'mdast-react-render'

import { PUBLIC_BASE_URL } from '../../lib/constants'

const schema = createFrontSchema({
  Link
})

const getDocument = gql`
  query getFront($path: String!, $first: Int!, $after: ID) {
    front: document(path: $path) {
      id
      children(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        nodes {
          id
          body
        }
      }
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

const styles = {
  spinner: css({
    textAlign: 'center',
    margin: '10px 0'
  })
}

class Front extends Component {
  render () {
    const { data, fetchMore, data: { front }, t, beforeNote } = this.props
    const meta = front && {
      ...front.meta,
      title: front.meta.title || t('pages/magazine/title'),
      url: `${PUBLIC_BASE_URL}${front.meta.path}`
    }

    return (
      <Frame
        raw
        meta={meta}
      >
        {beforeNote}
        <Loader loading={data.loading} error={data.error} message={t('pages/magazine/title')} render={() => {
          if (!front) {
            return <StatusError
              statusCode={404}
              serverContext={this.props.serverContext} />
          }

          const hasNextPage = front.children.pageInfo.hasNextPage
          return <InfiniteScroll
            loadMore={fetchMore}
            hasMore={hasNextPage}
            threshold={800}
            loader={
              <div {...styles.spinner}
                key='pagination-loader'>
                <InlineSpinner size={28} />
              </div>
            }>
            <SSRCachingBoundary key='content' cacheKey={front.id}>
              {() => renderMdast({
                type: 'root',
                children: front.children.nodes.map(v => v.body)
              }, schema)}
            </SSRCachingBoundary>
          </InfiniteScroll>
        }} />
      </Frame>
    )
  }
}

export default compose(
  withT,
  withRouter,
  graphql(getDocument, {
    options: props => ({
      variables: {
        path: props.path || props.router.asPath.split('?')[0],
        first: 15
      }
    }),
    props: ({data, ownProps: {serverContext}}) => {
      if (serverContext && !data.error && !data.loading && !data.front) {
        serverContext.res.statusCode = 503
      }

      return {
        data,
        fetchMore: () => {
          return data.fetchMore({
            variables: {
              first: 5,
              after: data.front && data.front.children.pageInfo.endCursor
            },
            updateQuery: (previousResult = {}, { fetchMoreResult = {} }) => {
              const previousSearch = previousResult.front.children || {}
              const currentSearch = fetchMoreResult.front.children || {}
              const previousNodes = previousSearch.nodes || []
              const currentNodes = currentSearch.nodes || []
              const res = {
                ...previousResult,
                front: {
                  ...previousResult.front,
                  children: {
                    ...previousResult.front.children,
                    nodes: [...previousNodes, ...currentNodes],
                    pageInfo: currentSearch.pageInfo
                  }
                }
              }
              return res
            }
          }).catch(error => console.error(error))
        }
      }
    }
  })
)(Front)
