import React from 'react'
import { withAggregations } from './enhancers'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { DEFAULT_AGGREGATION_KEYS, SUPPORTED_FILTERS } from './constants'

const findByKeyValue = (array, key, value) => array.find(e => e[key] === value)

const findAggregation = (aggregations, filter) => {
  const agg = findByKeyValue(aggregations, 'key', filter.key)
  return !agg || !agg.buckets
    ? agg
    : findByKeyValue(agg.buckets, 'value', filter.value)
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
    dataAggregations: {
      search: { aggregations }
    },
    selected,
    changeFilter
  }) => {
    if (!selected) {
      // TODO ? rerouting doesn't work server-side
      typeof document !== 'undefined' &&
        changeFilter(findFilterWithResults(aggregations))
      return null
    }

    return (
      <ul>
        {SUPPORTED_FILTERS.map((filter, key) => {
          const agg = findAggregation(aggregations, filter)
          // TODO: handle case where agg = undefined (maybe in backend?)
          return (
            <li key={key}>
              <a onClick={() => changeFilter(filter)}>
                {isSameFilter(filter, selected) && 'SELECTED'} {agg.label}{' '}
                {agg.count}
              </a>
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
