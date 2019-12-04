import React from 'react'
import { withAggregations } from './enhancers'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import {
  DEFAULT_AGGREGATION_KEYS,
  DEFAULT_FILTER,
  SUPPORTED_FILTERS
} from './constants'
import { css, merge } from 'glamor'
import { fontStyles, mediaQueries } from '@project-r/styleguide'
import { findByKey } from '../../lib/utils/helpers'
import EmptyState from './EmptyState'

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
  DEFAULT_FILTER

export const preselectFilter = dataAggregations => {
  const aggregations =
    dataAggregations.search && dataAggregations.search.aggregations
  return aggregations ? findFilterWithResults(aggregations) : DEFAULT_FILTER
}

const Filters = compose(withAggregations)(
  ({ dataAggregations, urlFilter, updateUrlFilter }) => {
    const { search } = dataAggregations
    if (!search) return <EmptyState />

    const { totalCount, aggregations } = search
    if (totalCount === 0 || !aggregations) return <EmptyState />

    return (
      <ul {...styles.list}>
        {SUPPORTED_FILTERS.map((filter, key) => {
          const agg = findAggregation(aggregations, filter)
          // TODO: handle case where agg is undefined (maybe in backend?)
          return agg ? (
            <li
              key={key}
              onClick={() => updateUrlFilter(filter)}
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
  }
)

const FiltersWrapper = compose(withSearchRouter)(
  ({ urlQuery, urlFilter, updateUrlFilter }) => {
    return urlQuery ? (
      <Filters
        searchQuery={urlQuery}
        keys={DEFAULT_AGGREGATION_KEYS}
        urlFilter={urlFilter}
        updateUrlFilter={updateUrlFilter}
      />
    ) : null
  }
)

export default FiltersWrapper
