import React from 'react'
import { withAggregations } from './enhancers'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { DEFAULT_AGGREGATION_KEYS, SUPPORTED_FILTERS } from './constants'
import { css, merge } from 'glamor'
import { fontStyles, mediaQueries } from '@project-r/styleguide'
import { findByKey } from '../../lib/utils/helpers'

// TODO: clean/mobile-friendly x-scroll for the tabs
const styles = {
  list: css({
    listStyle: 'none',
    padding: '0 0 20px',
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
  ({ dataAggregations, selected, changeFilter }) => {
    const { search } = dataAggregations
    if (!search) return null

    const { aggregations } = search
    if (!aggregations) return null

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
  ({ searchQuery, filter, onFilterChange }) => {
    return searchQuery ? (
      <Filters
        searchQuery={searchQuery}
        keys={DEFAULT_AGGREGATION_KEYS}
        selected={filter}
        changeFilter={onFilterChange}
      />
    ) : null
  }
)

export default FiltersWrapper
