import React from 'react'
import { withAggregations } from './enhancers'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { DEFAULT_AGGREGATION_KEYS, SUPPORTED_FILTERS } from './constants'
import { css, merge } from 'glamor'
import { fontStyles, mediaQueries } from '@project-r/styleguide'
import { findByKey } from '../../lib/utils/helpers'
import track from '../../lib/piwik'
import { EmptyState } from './Results'

// TODO: clean/mobile-friendly x-scroll for the tabs
const styles = {
  list: css({
    listStyle: 'none',
    padding: '0 0 40px',
    margin: 0,
    overflowX: 'auto',
    whiteSpace: 'nowrap'
  }),
  listItem: css({
    display: 'inline-block',
    marginRight: 30,
    cursor: 'pointer',
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      marginRight: 50
    }
  }),
  listItemSelected: css({
    textDecoration: 'underline'
  })
}

const findAggregation = (aggregations, filter) => {
  const agg = findByKey(aggregations, 'key', filter.key)
  return !agg || !agg.buckets
    ? agg
    : findByKey(agg.buckets, 'value', filter.value)
}

const isSameFilter = (filterA, filterB) =>
  filterA.key === filterB.key && filterA.value === filterB.value

const hasResults = (aggregations, filter) =>
  !!findAggregation(aggregations, filter).count

const findFilterWithResults = aggregations =>
  SUPPORTED_FILTERS.find(filter => hasResults(aggregations, filter)) ||
  SUPPORTED_FILTERS[0]

const Filters = compose(withAggregations)(
  ({
    dataAggregations,
    trackingId,
    searchQuery,
    selected,
    changeFilter,
    changeTrackingId
  }) => {
    const { search } = dataAggregations
    if (!search) return null

    const newTrackingId = search.trackingId
    if (!!newTrackingId && trackingId !== newTrackingId) {
      changeTrackingId(newTrackingId)
    }

    const { totalCount, aggregations } = search

    // TODO: doesn't work server side
    // TODO: can we put this in the graphql query??
    // track(['trackSiteSearch', searchQuery, false, totalCount])

    if (totalCount === 0 || !aggregations) return <EmptyState />

    if (!selected) {
      changeFilter(findFilterWithResults(aggregations))
      return null
    }

    return (
      <ul {...styles.list}>
        {SUPPORTED_FILTERS.map((filter, key) => {
          const agg = findAggregation(aggregations, filter)
          // TODO: handle case where agg = undefined (maybe in backend?)
          // TODO: use Link?
          return (
            <li
              key={key}
              onClick={() => changeFilter(filter)}
              {...merge(
                styles.listItem,
                isSameFilter(filter, selected) && styles.listItemSelected
              )}
            >
              {agg.label} <small>{agg.count}</small>
            </li>
          )
        })}
      </ul>
    )
  }
)

const FiltersWrapper = compose(withSearchRouter)(
  ({ searchQuery, filter, trackingId, onFilterChange, onTrackingIdChange }) => {
    return searchQuery ? (
      <Filters
        searchQuery={searchQuery}
        trackingId={trackingId}
        keys={DEFAULT_AGGREGATION_KEYS}
        selected={filter}
        changeFilter={onFilterChange}
        changeTrackingId={onTrackingIdChange}
      />
    ) : null
  }
)

export default FiltersWrapper
