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
import {
  colors,
  fontStyles,
  mediaQueries,
  Editorial
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'

const styles = {
  list: css({
    listStyle: 'none',
    padding: '0 0 40px',
    margin: 0
  }),
  listItem: css({
    display: 'inline-block',
    marginRight: 25,
    ...fontStyles.sansSerifRegular16,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      marginRight: 40
    }
  }),
  link: css({
    color: colors.text,
    '@media (hover)': {
      ':hover': {
        color: colors.lightText
      }
    },
    textDecoration: 'none'
  }),
  linkSelected: css({
    textDecoration: 'underline',
    textDecorationSkip: 'ink',
    '@media (hover)': {
      ':hover': {
        color: colors.text
      }
    }
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
)(
  ({
    dataAggregations,
    searchQuery,
    urlFilter,
    updateUrlFilter,
    getSearchParams
  }) => {
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
          if (!agg) {
            return null
          }

          const text = (
            <>
              {agg.label} <small>{agg.count}</small>
            </>
          )

          return (
            <li key={key} {...styles.listItem}>
              {agg.count ? (
                <Link
                  route='search'
                  params={getSearchParams({ filter })}
                  passHref
                >
                  <a
                    {...merge(
                      styles.link,
                      isSameFilter(filter, urlFilter) && styles.linkSelected
                    )}
                  >
                    {text}
                  </a>
                </Link>
              ) : (
                text
              )}
            </li>
          )
        })}
      </ul>
    )
  }
)

export default Filters
