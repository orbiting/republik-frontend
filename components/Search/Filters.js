import React, { useEffect } from 'react'
import { withAggregations } from './enhancers'
import { compose } from 'react-apollo'
import withSearchRouter, { isDefaultFilter } from './withSearchRouter'
import {
  DEFAULT_AGGREGATION_KEYS,
  DEFAULT_FILTER,
  SUPPORTED_FILTERS
} from './constants'
import { css, merge } from 'glamor'
import { fontStyles, mediaQueries } from '@project-r/styleguide'

const styles = {
  list: css({
    listStyle: 'none',
    padding: '0 0 40px',
    margin: 0
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

export const findAggregation = (aggregations, filter) => {
  const agg = aggregations.find(d => d.key === filter.key)
  return !agg || !agg.buckets
    ? agg
    : agg.buckets.find(d => d.value === filter.value)
}

const isSameFilter = (filterA, filterB) =>
  filterA.key === filterB.key && filterA.value === filterB.value

const hasResults = (aggregations, filter) =>
  !!findAggregation(aggregations, filter).count

const findFilterWithResults = aggregations =>
  SUPPORTED_FILTERS.find(filter => hasResults(aggregations, filter)) ||
  DEFAULT_FILTER

const Filters = compose(
  withSearchRouter,
  withAggregations
)(({ dataAggregations, searchQuery, urlFilter, updateUrlFilter }) => {
  const { search, loading, error } = dataAggregations
  if (loading || error) return null

  const { totalCount, aggregations } = search
  if (!aggregations) return null

  const updateFilter = () => {
    if (!isDefaultFilter(urlFilter)) {
      return
    }
    const newFilter = findFilterWithResults(aggregations)
    updateUrlFilter(newFilter)
  }

  useEffect(() => {
    updateFilter()
  }, [aggregations])

  const onFilterClick = filter => {
    updateUrlFilter(filter)
  }

  return (
    <ul {...styles.list}>
      {SUPPORTED_FILTERS.map((filter, key) => {
        const agg = findAggregation(aggregations, filter)
        return agg ? (
          <li
            key={key}
            onClick={() => onFilterClick(filter)}
            {...merge(
              styles.listItem,
              isSameFilter(filter, urlFilter) && styles.listItemSelected
            )}
          >
            {agg.label} <small>{agg.count}</small>
          </li>
        ) : null
      })}
    </ul>
  )
})

export default Filters
