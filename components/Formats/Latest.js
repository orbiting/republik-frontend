import React, { Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'

import ActionBar from '../ActionBar/Feed'
import { documentFragment } from '../Feed/DocumentListContainer'
import { TeaserFeed, Loader, colors, fontStyles, linkRule, mediaQueries } from '@project-r/styleguide'
import Link from '../Link/Href'

import withT from '../../lib/withT'

const styles = {
  container: css({
    paddingTop: 0
  }),
  results: css({
    paddingTop: 60
  }),
  countPreloaded: css({
    paddingBottom: '15px',
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  }),
  countLoaded: css({
    borderTop: `1px solid ${colors.text}`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    textAlign: 'left',
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  }),
  button: css({
    ...fontStyles.sansSerifRegular21,
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: '0 auto 0',
    display: 'block'
  })
}

const getFeedDocuments = gql`
query getFeedDocuments($cursor: String) {
  documents(feed: true, hasFormat: true, first: 10, after: $cursor) {
    pageInfo {
      endCursor
      hasNextPage
    }
    nodes {
      ...DocumentListDocument
    }
  }
}
${documentFragment}
`

const Latest = ({ t, data: { loading, error, documents }, loadMore, hasMore }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => {
      const { pageInfo } = documents

      return (
        <Fragment>
          {documents &&
            documents.nodes
              .map(doc => (
                <TeaserFeed
                  {...doc.meta}
                  title={doc.meta.shortTitle || doc.meta.title}
                  description={!doc.meta.shortTitle && doc.meta.description}
                  Link={Link}
                  key={doc.meta.path}
                  bar={(
                    <ActionBar
                      documentId={doc.id}
                      userBookmark={doc.userBookmark}
                      userProgress={doc.userProgress}
                      {...doc.meta}
                    />
                  )}
                />
              ))}
          {pageInfo.hasNextPage && (
            <button
              {...styles.button}
              {...linkRule}
              onClick={() => {
                loadMore({ after: pageInfo.endCursor })
              }}
            >
              {t('formats/loadMore')}
            </button>
          )}
        </Fragment>
      )
    }}
  />
)

export default compose(
  withT,
  graphql(getFeedDocuments, {
    props: ({ data, ownProps }) => ({
      data,
      loadMore: ({ after }) =>
        data.fetchMore({
          variables: {
            cursor: after
          },
          updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
            const nodes = [
              ...previousResult.documents.nodes,
              ...fetchMoreResult.documents.nodes
            ]
            return {
              ...fetchMoreResult,
              documents: {
                ...fetchMoreResult.documents,
                nodes
              }
            }
          }
        })
    })
  }
  )
)(Latest)
