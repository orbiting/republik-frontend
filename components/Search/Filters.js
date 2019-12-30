import React, { useEffect } from 'react'
import { withAggregations } from './enhancers'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import {
  DEFAULT_AGGREGATION_KEYS,
  DEFAULT_FILTER,
  SUPPORTED_FILTERS,
  isSameFilter,
  findAggregation
} from './constants'
import { css, merge } from 'glamor'
import {
  colors,
  fontStyles,
  mediaQueries,
  Editorial
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'
import { countFormat } from '../../lib/utils/format'

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

const Filters = compose(
  withSearchRouter,
  withAggregations
)(({ dataAggregations, searchQuery, urlFilter, getSearchParams, sort }) => {
  const { search, loading, error } = dataAggregations
  if (loading || error) return null

  const { totalCount, aggregations } = search
  if (!aggregations) return null

  return (
    <ul {...styles.list}>
      {SUPPORTED_FILTERS.map((filter, key) => {
        const agg = findAggregation(aggregations, filter)
        if (!agg) {
          return null
        }

        const text = (
          <>
            {agg.label} <small>{countFormat(agg.count)}</small>
          </>
        )

        return (
          <li key={key} {...styles.listItem}>
            {agg.count ? (
              <Link
                route='search'
                params={getSearchParams({ filter, sort })}
                passHref
              >
                <a
                  {...merge(
                    styles.link,
                    !sort &&
                      isSameFilter(filter, urlFilter) &&
                      styles.linkSelected
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
})

export default Filters
