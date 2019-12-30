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
  mediaQueries
} from '@project-r/styleguide'
import withSearchRouter from './withSearchRouter'
import { DEFAULT_FILTERS } from './constants'

const RESULT_COMPONENTS = {
  Document: DocumentResult,
  Comment: CommentResult,
  User: UserResult
}

const styles = {
  container: css({
    paddingTop: 0,
    paddingBottom: 120
  }),
  results: css({
    paddingTop: 5
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

const Results = compose(
  withSearchRouter,
  withResults
)(({ data: { loading, error, search } = {}, fetchMore }) => {
  return (
    <div {...styles.container}>
      <Loader
        loading={
          loading ||
          // wait for index to switch tab
          (search && search.totalCount === 0)
        }
        error={error}
        render={() => {
          const { nodes, totalCount } = search

          return (
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

export default Results
