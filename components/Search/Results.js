import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'

import ActionBar from '../ActionBar/Feed'
import CommentLink from '../Discussion/CommentLink'
import Loader from '../../components/Loader'
import Link from '../Link/Href'

import Sort from './Sort'
import UserTeaser from './UserTeaser'

import { withAggregations, withResults } from './enhancers'

import {
  colors,
  fontStyles,
  linkRule,
  mediaQueries,
  CommentTeaser,
  RawHtml,
  TeaserFeed
} from '@project-r/styleguide'

const styles = {
  container: css({
    paddingTop: 0
  }),
  results: css({
    paddingTop: 60
  }),
  empty: css({
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular19
    }
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
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  }),
  highlight: css({
    '& em': {
      background: colors.primaryBg,
      fontStyle: 'normal'
    }
  })
}

const SortPanel = ({ searchQuery, sort, totalCount, onSortClick }) => {
  return (
    <div>
      {totalCount > 1 && (
        <Sort
          sort={sort}
          searchQuery={searchQuery}
          onClickHandler={onSortClick}
        />
      )}
    </div>
  )
}

class Results extends Component {
  constructor(props, ...args) {
    super(props, ...args)
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.data && props.data.search) {
      this.props.onSearchLoaded && this.props.onSearchLoaded(props.data.search)
    }
  }

  render() {
    const {
      t,
      data,
      searchQuery,
      sort,
      onSortClick,
      onLoadMoreClick
    } = this.props

    return (
      <div {...styles.container}>
        <Loader
          loading={data.loading}
          error={data.error}
          render={() => {
            const { data, fetchMore } = this.props
            const { search } = data

            if (!search) {
              return null
            }
            const { nodes, totalCount, pageInfo } = search

            if (totalCount === 0) {
              return (
                <div {...styles.empty}>
                  <RawHtml
                    dangerouslySetInnerHTML={{
                      __html: t('search/results/empty')
                    }}
                  />
                </div>
              )
            }

            return (
              <Fragment>
                <SortPanel
                  sort={sort}
                  totalCount={totalCount}
                  searchQuery={searchQuery}
                  onSortClick={onSortClick}
                />
                {!!searchQuery && (
                  <div {...styles.results}>
                    {nodes &&
                      nodes.map((node, index) => {
                        const titleHighlight =
                          node.entity.__typename === 'Document' &&
                          node.highlights.find(
                            highlight => highlight.path === 'meta.title'
                          )
                        const descHighlight =
                          node.entity.__typename === 'Document' &&
                          node.highlights.find(
                            highlight => highlight.path === 'meta.description'
                          )
                        const bar = node.entity.meta ? (
                          <ActionBar
                            documentId={node.entity.id}
                            userBookmark={node.entity.userBookmark}
                            userProgress={node.entity.userProgress}
                            {...node.entity.meta}
                          />
                        ) : null
                        return (
                          <Fragment key={index}>
                            {node.entity.__typename === 'Document' && (
                              <TeaserFeed
                                {...node.entity.meta}
                                title={
                                  titleHighlight ? (
                                    <span
                                      {...styles.highlight}
                                      dangerouslySetInnerHTML={{
                                        __html: titleHighlight.fragments[0]
                                      }}
                                    />
                                  ) : (
                                    node.entity.meta.shortTitle ||
                                    node.entity.meta.title
                                  )
                                }
                                description={
                                  descHighlight ? (
                                    <span
                                      {...styles.highlight}
                                      dangerouslySetInnerHTML={{
                                        __html: descHighlight.fragments[0]
                                      }}
                                    />
                                  ) : (
                                    !node.entity.meta.shortTitle &&
                                    node.entity.meta.description
                                  )
                                }
                                kind={
                                  node.entity.meta.template ===
                                  'editorialNewsletter'
                                    ? 'meta'
                                    : node.entity.meta.kind
                                }
                                publishDate={
                                  node.entity.meta.template === 'format'
                                    ? null
                                    : node.entity.meta.publishDate
                                }
                                Link={Link}
                                key={node.entity.meta.path}
                                bar={bar}
                              />
                            )}
                            {node.entity.__typename === 'Comment' && (
                              <CommentTeaser
                                {...node.entity}
                                context={{
                                  title: node.entity.discussion.title
                                }}
                                highlights={node.highlights}
                                Link={CommentLink}
                                t={t}
                              />
                            )}
                            {node.entity.__typename === 'User' && (
                              <UserTeaser {...node.entity} />
                            )}
                          </Fragment>
                        )
                      })}
                    {totalCount > 0 && (
                      <div {...styles.countLoaded}>
                        {nodes && nodes.length === totalCount
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
                            onClick={() => {
                              onLoadMoreClick && onLoadMoreClick()
                              fetchMore({ after: pageInfo.endCursor })
                            }}
                          >
                            {t('search/pageInfo/loadMore')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Fragment>
            )
          }}
        />
      </div>
    )
  }
}

Results.propTypes = {
  t: PropTypes.func,
  data: PropTypes.object,
  dataAggregations: PropTypes.object,
  searchQuery: PropTypes.string,
  sort: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['ASC', 'DESC'])
  }),
  onSortClick: PropTypes.func,
  onLoadMoreClick: PropTypes.func,
  fetchMore: PropTypes.func,
  onSearchLoaded: PropTypes.func,
  trackingId: PropTypes.string
}

export default compose(
  withT,
  withAggregations,
  withResults
)(Results)
