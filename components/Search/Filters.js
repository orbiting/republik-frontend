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
import { fontStyles, mediaQueries, RawHtml } from '@project-r/styleguide'
import { findByKey } from '../../lib/utils/helpers'
import withT from '../../lib/withT'

// TODO: clean/mobile-friendly x-scroll for the tabs
// TODO: 2 rows
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
  }),
  empty: css({
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular19
    }
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

const EmptyState = compose(withT)(({ t }) => (
  <div {...styles.empty}>
    <RawHtml
      dangerouslySetInnerHTML={{
        __html: t('search/results/empty')
      }}
    />
  </div>
))

const Filters = compose(withAggregations)(
  ({ dataAggregations, selected, updateUrlFilter }) => {
    const { search } = dataAggregations
    if (!search) return <EmptyState />

    const { totalCount, aggregations } = search
    if (totalCount === 0 || !aggregations) return <EmptyState />

    return (
      <ul {...styles.list}>
        {SUPPORTED_FILTERS.map((filter, key) => {
          const agg = findAggregation(aggregations, filter)
          // TODO: handle case where agg = undefined (maybe in backend?)
          return (
            <li
              key={key}
              onClick={() => updateUrlFilter(filter)}
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
  ({ urlQuery, urlFilter, updateUrlFilter }) => {
    return urlQuery ? (
      <Filters
        searchQuery={urlQuery}
        keys={DEFAULT_AGGREGATION_KEYS}
        selected={urlFilter}
        updateUrlFilter={updateUrlFilter}
      />
    ) : null
  }
)

export default FiltersWrapper
