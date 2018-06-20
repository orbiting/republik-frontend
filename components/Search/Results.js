import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'

import Loader from '../../components/Loader'
import Link from '../Link/Href'

import Filter from './Filter'
import Sort from './Sort'
import CommentTeaser from './CommentTeaser'
import UserTeaser from './UserTeaser'

import { withAggregations, withResults } from './enhancers'

import {
  colors,
  fontStyles,
  linkRule,
  mediaQueries,
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

const FilterSortPanel = ({
  aggregations,
  filterQuery,
  filters,
  loadingFilters,
  minHeight,
  isFilterEnabled,
  searchQuery,
  setPanelRef,
  sort,
  t,
  totalCount,
  onFilterClick,
  onSearch,
  onSortClick
}) => {
  const resultsOutdated = searchQuery !== filterQuery
  const showResults = !!searchQuery || isFilterEnabled
  return (
    <div ref={setPanelRef} style={{ minHeight }}>
      <Filter
        aggregations={aggregations}
        searchQuery={filterQuery || searchQuery}
        filters={filters}
        loadingFilters={loadingFilters}
        allowCompact={showResults}
        onClickHandler={onFilterClick}
      />
      {filterQuery && (
        <div {...styles.countPreloaded} aria-live='assertive'>
          {totalCount > 0 && (
            <Fragment>
              {resultsOutdated && (
                <button {...styles.button} {...linkRule} onClick={onSearch}>
                  {t.pluralize('search/preloaded/showresults', {
                    count: totalCount
                  })}
                </button>
              )}
              {!resultsOutdated && (
                <Fragment>
                  {t.pluralize('search/preloaded/results', {
                    count: totalCount
                  })}
                </Fragment>
              )}
            </Fragment>
          )}
          {resultsOutdated && totalCount === 0 && (
            <Fragment>{t('search/preloaded/results/0')}</Fragment>
          )}
        </div>
      )}
      {!resultsOutdated && showResults && totalCount > 1 && (
        <Sort
          sort={sort}
          searchQuery={searchQuery}
          isFilterEnabled={isFilterEnabled}
          onClickHandler={onSortClick}
        />
      )}
    </div>
  )
}

class Results extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      minHeight: null
    }

    this.setPanelRef = ref => {
      this.panelRef = ref
    }

    this.measure = () => {
      if (this.panelRef) {
        const { searchQuery, filterQuery } = this.props
        const shouldMeasure = searchQuery === filterQuery
        const currentMinHeight = this.panelRef.style.minHeight
        this.panelRef.style.minHeight = 0
        const minHeight = this.panelRef.getBoundingClientRect().height
        this.panelRef.style.minHeight = currentMinHeight
        if (shouldMeasure && minHeight !== this.state.minHeight) {
          this.setState({minHeight})
        }
      }
    }
  }

  componentDidMount () {
    this.measure()
  }

  componentDidUpdate () {
    this.measure()
  }

  componentWillReceiveProps (props) {
    if (props.data && props.data.search) {
      this.props.onSearchLoaded && this.props.onSearchLoaded(props.data.search)
    }
    if (!props.dataAggregations || !props.dataAggregations.search) return
    const { search } = props.dataAggregations
    const { aggregations, totalCount } = search
    this.props.onTotalCountLoaded && this.props.onTotalCountLoaded(totalCount)
    this.props.onAggregationsLoaded && this.props.onAggregationsLoaded(aggregations)
  }

  render () {
    const {
      t,
      data,
      dataAggregations,
      searchQuery,
      filterQuery,
      sort,
      onSearch,
      onSortClick,
      filters,
      onFilterClick,
      loadingFilters,
      onLoadMoreClick,
      preloadedTotalCount,
      preloadedAggregations
    } = this.props

    const isFilterEnabled =
      filters &&
      !!filters.length &&
      !!filters.find(
        filter => !(filter.key === 'template' && filter.value === 'front')
      )

    const resultsOutdated = searchQuery !== filterQuery
    const opacity = resultsOutdated ? 0.5 : 1
    const { minHeight } = this.state
    const keepCachedAggregations = preloadedTotalCount !== 0 && preloadedAggregations !== null

    return (
      <div {...styles.container}>
        {resultsOutdated && !keepCachedAggregations && (
          <Loader
            loading={dataAggregations && dataAggregations.loading}
            error={dataAggregations && dataAggregations.error}
            render={() => {
              const { search } = dataAggregations
              const { aggregations, totalCount } = search

              return (
                <FilterSortPanel
                  aggregations={aggregations}
                  filterQuery={filterQuery}
                  filters={filters}
                  loadingFilters={loadingFilters}
                  minHeight={minHeight}
                  isFilterEnabled={isFilterEnabled}
                  searchQuery={searchQuery}
                  setPanelRef={this.setPanelRef}
                  sort={sort}
                  t={t}
                  totalCount={totalCount}
                  onFilterClick={onFilterClick}
                  onSearch={onSearch}
                  onSortClick={onSortClick}
                />
              )
            }}
          />
        )}
        {keepCachedAggregations && (
          <FilterSortPanel
            aggregations={preloadedAggregations}
            filterQuery={filterQuery}
            filters={filters}
            loadingFilters={loadingFilters}
            minHeight={minHeight}
            isFilterEnabled={isFilterEnabled}
            searchQuery={searchQuery}
            setPanelRef={this.setPanelRef}
            sort={sort}
            t={t}
            totalCount={preloadedTotalCount}
            onFilterClick={onFilterClick}
            onSearch={onSearch}
            onSortClick={onSortClick}
          />
        )}
        <Loader
          loading={data.loading}
          error={data.error}
          render={() => {
            const { data, fetchMore } = this.props
            const { search } = data

            if (!search) {
              return null
            }
            const { aggregations, nodes, totalCount, pageInfo } = search

            if (totalCount === 0 && !resultsOutdated) {
              return (
                <div {...styles.empty}>
                  <RawHtml
                    dangerouslySetInnerHTML={{
                      __html: t('search/results/empty',
                        { term: filterQuery }
                      )
                    }}
                  />
                </div>
              )
            }

            return (
              <Fragment>
                {!resultsOutdated && !keepCachedAggregations && (
                  <FilterSortPanel
                    aggregations={aggregations}
                    filterQuery={filterQuery}
                    filters={filters}
                    loadingFilters={loadingFilters}
                    minHeight={minHeight}
                    isFilterEnabled={isFilterEnabled}
                    searchQuery={searchQuery}
                    setPanelRef={this.setPanelRef}
                    sort={sort}
                    t={t}
                    totalCount={totalCount}
                    onFilterClick={onFilterClick}
                    onSearch={onSearch}
                    onSortClick={onSortClick}
                  />
                )}
                {(!!searchQuery || isFilterEnabled) && (
                  <div {...styles.results} style={{ opacity }}>
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
                                    node.entity.meta.description
                                  )
                                }
                                kind={
                                  node.entity.meta.template ===
                                  'editorialNewsletter' ? (
                                      'meta'
                                    ) : (
                                      node.entity.meta.kind
                                    )
                                }
                                publishDate={
                                  node.entity.meta.template ===
                                  'format' ? null : (
                                      node.entity.meta.publishDate
                                    )
                                }
                                Link={Link}
                                key={node.entity.meta.path}
                              />
                            )}
                            {node.entity.__typename === 'Comment' && (
                              <CommentTeaser
                                {...node.entity}
                                highlights={node.highlights}
                                t={t}
                              />
                            )}
                            {node.entity.__typename === 'User' && (
                              <UserTeaser {...node.entity} />
                            )}
                          </Fragment>
                        )
                      })}
                    {totalCount > 0 &&
                      <div {...styles.countLoaded}>
                        {nodes && nodes.length === totalCount ? (
                          t.pluralize('search/pageInfo/total', {
                            count: totalCount
                          })
                        ) : (
                          t('search/pageInfo/loadedTotal', {
                            loaded: nodes.length,
                            total: totalCount
                          })
                        )}
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
                    }
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
  filterQuery: PropTypes.string,
  sort: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['ASC', 'DESC'])
  }),
  onSearch: PropTypes.func,
  onSortClick: PropTypes.func,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      not: PropTypes.bool
    })
  ),
  onFilterClick: PropTypes.func,
  loadingFilters: PropTypes.bool,
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
