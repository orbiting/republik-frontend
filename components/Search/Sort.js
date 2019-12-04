import React, { Fragment } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'

import ArrowDown from 'react-icons/lib/md/arrow-downward'
import ArrowUp from 'react-icons/lib/md/arrow-upward'

import { colors, fontStyles, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { DEFAULT_AGGREGATION_KEYS, SUPPORTED_SORT } from './constants'
import { withAggregations } from './enhancers'
import { findAggregation } from './Filters'

const styles = {
  container: css({
    paddingTop: '3px'
  }),
  button: css({
    ...fontStyles.sansSerifRegular14,
    outline: 'none',
    color: colors.text,
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    marginRight: '17px',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16,
      marginRight: '30px'
    }
  }),
  icon: css({
    display: 'inline-block',
    lineHeight: 0,
    verticalAlign: 'text-bottom'
  })
}

const SORT_DIRECTION_ICONS = {
  ASC: ArrowUp,
  DESC: ArrowDown
}

const getDefaultDirection = sort => sort.directions && sort.directions[0]

const getNextDirection = (sort, directions) => {
  const index = directions.indexOf(sort.direction)
  return index === directions.length - 1 ? directions[0] : directions[index + 1]
}

const SortButton = compose(withT)(({ t, sort, urlSort, updateUrlSort }) => {
  const selected = urlSort.key === sort.key
  const color = selected ? colors.primary : null
  const label = t(`search/sort/${sort.key}`)
  const direction = selected ? urlSort.direction : getDefaultDirection(sort)

  return (
    <button
      {...styles.button}
      style={{ color }}
      onClick={() => {
        updateUrlSort({
          key: sort.key,
          direction:
            selected && direction
              ? getNextDirection(urlSort, sort.directions)
              : direction
        })
      }}
    >
      {label}
      {direction && (
        <span
          {...styles.icon}
          role='button'
          title={t(`search/sort/${direction}/aria`)}
        >
          {React.createElement(SORT_DIRECTION_ICONS[direction])}
        </span>
      )}
    </button>
  )
})

const Sort = compose(withAggregations)(
  ({ dataAggregations, urlFilter, urlSort, updateUrlSort }) => {
    const { search } = dataAggregations
    if (!search) return null

    const { aggregations } = search
    const currentAgg = findAggregation(aggregations, urlFilter)
    if (!currentAgg || currentAgg.count === 0) return null

    return (
      <div {...styles.container}>
        {SUPPORTED_SORT.map((sort, key) => {
          return (
            <Fragment key={key}>
              <SortButton
                sort={sort}
                urlSort={urlSort}
                updateUrlSort={updateUrlSort}
              />
            </Fragment>
          )
        })}
      </div>
    )
  }
)

const SortWrapper = compose(withSearchRouter)(
  ({ urlQuery, urlFilter, urlSort, updateUrlSort }) => {
    return urlQuery && urlFilter ? (
      <Sort
        searchQuery={urlQuery}
        keys={DEFAULT_AGGREGATION_KEYS}
        urlFilter={urlFilter}
        urlSort={urlSort}
        updateUrlSort={updateUrlSort}
      />
    ) : null
  }
)

export default SortWrapper
