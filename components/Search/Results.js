import React, { Fragment } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'

import Loader from '../../components/Loader'

import UserResult from './UserResult'
import DocumentResult from './DocumentResult'
import CommentResult from './CommentResult'

import { withResults } from './enhancers'

import {
  colors,
  fontStyles,
  linkRule,
  mediaQueries,
  RawHtml
} from '@project-r/styleguide'
import withSearchRouter from './withSearchRouter'
import track from '../../lib/piwik'

const RESULT_COMPONENTS = {
  Document: DocumentResult,
  Comment: CommentResult,
  User: UserResult
}

const styles = {
  container: css({
    paddingTop: 0
  }),
  results: css({
    paddingTop: 5
  }),
  empty: css({
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular19
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
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  })
}

export const EmptyState = compose(withT)(({ t }) => (
  <div {...styles.empty}>
    <RawHtml
      dangerouslySetInnerHTML={{
        __html: t('search/results/empty')
      }}
    />
  </div>
))

const ResultsList = ({ nodes }) => {
  const nodeType = nodes[0].entity.__typename

  return (
    <>
      {nodes.map((node, index) => {
        return (
          <Fragment key={index}>
            {React.createElement(RESULT_COMPONENTS[nodeType], {
              node: node
            })}
          </Fragment>
        )
      })}
    </>
  )
}

const ResultsFooter = compose(withT)(
  ({ t, search: { nodes, totalCount, pageInfo }, fetchMore }) => {
    return (
      <div {...styles.countLoaded}>
        {nodes.length === totalCount
          ? t.pluralize('search/pageInfo/total', {
              count: totalCount
            })
          : t('search/pageInfo/loadedTotal', {
              loaded: nodes.length,
              total: totalCount
            })}
        {pageInfo.hasNextPage && (
          <button
            {...styles.button}
            {...linkRule}
            onClick={() => fetchMore({ after: pageInfo.endCursor })}
          >
            {t('search/pageInfo/loadMore')}
          </button>
        )}
      </div>
    )
  }
)

const Results = compose(withResults)(({ data, fetchMore }) => {
  return (
    <div {...styles.container}>
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          const { search } = data

          if (!search) return null

          const { nodes, totalCount } = search

          !nodes || !totalCount ? (
            <EmptyState />
          ) : (
            <div {...styles.results}>
              <ResultsList nodes={nodes} />
              <ResultsFooter search={search} fetchMore={fetchMore} />
            </div>
          )
        }}
      />
    </div>
  )
})

const ResultsWrapper = compose(withSearchRouter)(
  ({ searchQuery, filter, sort, trackingId }) => {
    return searchQuery && filter && sort ? (
      <Results
        searchQuery={searchQuery}
        filters={[filter]}
        sort={sort}
        trackingId={trackingId}
      />
    ) : null
  }
)

export default ResultsWrapper
