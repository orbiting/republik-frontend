import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import { Editorial, InlineSpinner } from '@project-r/styleguide'
import { withRouter } from 'next/router'
import StatusError from '../StatusError'
import Head from 'next/head'

import createFrontSchema from '@project-r/styleguide/lib/templates/Front'

import withT from '../../lib/withT'
import Loader from '../Loader'
import Frame from '../Frame'
import Link from '../Link/Href'
import SSRCachingBoundary from '../SSRCachingBoundary'
import ErrorMessage from '../ErrorMessage'

import { negativeColors } from '../Frame/Footer'

import { renderMdast } from 'mdast-react-render'

import { PUBLIC_BASE_URL } from '../../lib/constants'
import { cleanAsPath } from '../../lib/routes'

import { useInfiniteScroll } from '../../lib/hooks/useInfiniteScroll'

const schema = createFrontSchema({
  Link
})

const getDocument = gql`
  query getFront($path: String!, $first: Int!, $after: ID, $only: ID) {
    front: document(path: $path) {
      id
      children(first: $first, after: $after, only: $only) {
        totalCount
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
  more: css({
    backgroundColor: negativeColors.containerBg,
    color: negativeColors.text,
    textAlign: 'center',
    padding: '20px 0'
  })
}

const Front = ({
  data,
  fetchMore,
  data: { front },
  t,
  renderBefore,
  renderAfter,
  containerStyle,
  extractId,
  serverContext
}) => {
  const meta = front && {
    ...front.meta,
    title: front.meta.title || t('pages/magazine/title'),
    url: `${PUBLIC_BASE_URL}${front.meta.path}`
  }

  if (extractId) {
    return (
      <Loader loading={data.loading} error={data.error} render={() => {
        if (!front) {
          return <StatusError
            statusCode={404}
            serverContext={serverContext} />
        }
        return (
          <Fragment>
            <Head>
              <meta name='robots' content='noindex' />
            </Head>
            {renderMdast({
              type: 'root',
              children: front.children.nodes.map(v => v.body)
            }, schema)}
          </Fragment>
        )
      }} />
    )
  }

  const hasMore = front && front.children.pageInfo.hasNextPage
  const [
    { containerRef, infiniteScroll, loadingMore, loadingMoreError },
    setInfiniteScroll
  ] = useInfiniteScroll({
    hasMore,
    loadMore: fetchMore
  })

  return (
    <Frame
      raw
      meta={meta}
    >
      {renderBefore && renderBefore(meta)}
      <Loader loading={data.loading} error={data.error} message={t('pages/magazine/title')} render={() => {
        if (!front) {
          return <StatusError
            statusCode={404}
            serverContext={serverContext} />
        }

        return <div ref={containerRef} style={containerStyle}>
          <SSRCachingBoundary key='content' cacheKey={front.id}>
            {() => renderMdast({
              type: 'root',
              children: front.children.nodes.map(v => v.body)
            }, schema)}
          </SSRCachingBoundary>
          {hasMore && <div {...styles.more}>
            {loadingMoreError && <ErrorMessage error={loadingMoreError} />}
            {loadingMore && <InlineSpinner />}
            {!infiniteScroll && hasMore &&
            <Editorial.A href='#' style={{ color: negativeColors.text }} onClick={event => {
              event && event.preventDefault()
              setInfiniteScroll(true)
            }}>
              {
                t('front/loadMore',
                  {
                    count: front.children.nodes.length,
                    remaining: front.children.totalCount - front.children.nodes.length
                  }
                )
              }
            </Editorial.A>
            }
          </div>}
        </div>
      }} />
      {renderAfter && renderAfter(meta)}
    </Frame>
  )
}

export default compose(
  withT,
  withRouter,
  graphql(getDocument, {
    options: props => ({
      variables: {
        path: props.path || cleanAsPath(props.router.asPath),
        first: 15,
        only: props.extractId
      }
    }),
    props: ({ data, ownProps: { serverContext } }) => {
      if (serverContext && !data.loading && !data.front) {
        serverContext.res.statusCode = 503
      }

      return {
        data,
        fetchMore: () => {
          return data.fetchMore({
            variables: {
              first: 15,
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
