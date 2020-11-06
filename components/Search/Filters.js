import React, { useMemo } from 'react'
import { withAggregations } from './enhancers'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { SUPPORTED_FILTERS, isSameFilter, findAggregation } from './constants'
import { css, merge } from 'glamor'
import {
  fontStyles,
  mediaQueries,
  useColorContext
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
    textDecoration: 'none'
  }),
  linkSelected: css({
    textDecoration: 'underline',
    textDecorationSkip: 'ink'
  })
}

const Filters = compose(
  withSearchRouter,
  withAggregations
)(({ dataAggregations, urlFilter, getSearchParams, sort }) => {
  const { search, loading, error } = dataAggregations
  const [colorScheme] = useColorContext()
  if (loading || error) return null

  const { aggregations } = search
  if (!aggregations) return null
  const styleRules = useMemo(() => {
    return {
      link: css({
        '@media (hover)': {
          ':hover': {
            color: colorScheme.getCSSColor('textSoft')
          }
        }
      })
    }
  }, [colorScheme])
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
                  {...styles.link}
                  {...colorScheme.set('color', 'text')}
                  {...(sort &&
                    !isSameFilter(filter, urlFilter) &&
                    styleRules.link)}
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
