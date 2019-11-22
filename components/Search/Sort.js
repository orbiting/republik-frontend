import React, { Fragment } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'

import ArrowDown from 'react-icons/lib/md/arrow-downward'
import ArrowUp from 'react-icons/lib/md/arrow-upward'

import { colors, fontStyles, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { findByKey } from '../../lib/utils/helpers'
import { DEFAULT_SORT, SUPPORTED_SORT } from './constants'

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

const SortButton = compose(withT)(({ t, sort, selected, changeSort }) => {
  const isSelected = selected.key === sort.key
  const color = isSelected ? colors.primary : null
  const label = t(`search/sort/${sort.key}`)
  const direction = isSelected ? selected.direction : getDefaultDirection(sort)

  return (
    <button
      {...styles.button}
      style={{ color }}
      onClick={() => {
        changeSort({
          key: sort.key,
          direction:
            isSelected && direction
              ? getNextDirection(selected, sort.directions)
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

const Sort = ({ selected, changeSort }) => {
  if (!selected) {
    changeSort(findByKey(SUPPORTED_SORT, 'key', DEFAULT_SORT))
    return null
  }

  return (
    <div {...styles.container}>
      {SUPPORTED_SORT.map((sort, key) => {
        return (
          <Fragment key={key}>
            <SortButton
              sort={sort}
              selected={selected}
              changeSort={changeSort}
            />
          </Fragment>
        )
      })}
    </div>
  )
}

const SortWrapper = compose(withSearchRouter)(
  ({ searchQuery, filter, sort, onSortChange }) => {
    return searchQuery && filter ? (
      <Sort selected={sort} changeSort={onSortChange} />
    ) : null
  }
)

export default SortWrapper
