import React from 'react'
import { css } from 'glamor'

import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'

import { colors, fontStyles, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { SUPPORTED_SORT } from './constants'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

const styles = {
  container: css({
    paddingTop: '3px'
  }),
  link: css({
    ...fontStyles.sansSerifRegular14,
    marginRight: '17px',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular16,
      marginRight: '30px'
    },
    color: colors.text,
    '@media (hover)': {
      ':hover': {
        color: colors.lightText
      }
    },
    textDecoration: 'none'
  }),
  icon: css({
    display: 'inline-block',
    lineHeight: 0,
    verticalAlign: 'text-bottom'
  })
}

const SORT_DIRECTION_ICONS = {
  ASC: MdArrowUpward,
  DESC: MdArrowDownward
}

const getDefaultDirection = sort => sort.directions && sort.directions[0]

const getNextDirection = (sort, directions) => {
  const index = directions.indexOf(sort.direction)
  return index === directions.length - 1 ? directions[0] : directions[index + 1]
}

const SortToggle = compose(withT)(({ t, sort, urlSort, getSearchParams }) => {
  const selected = urlSort.key === sort.key
  const color = selected ? colors.primary : undefined
  const label = t(`search/sort/${sort.key}`)
  const direction = selected ? urlSort.direction : getDefaultDirection(sort)

  return (
    <Link
      route='search'
      params={getSearchParams({
        sort: {
          key: sort.key,
          direction:
            selected && direction
              ? getNextDirection(urlSort, sort.directions)
              : direction
        }
      })}
      passHref
    >
      <a {...styles.link} style={{ color }}>
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
      </a>
    </Link>
  )
})

const Sort = compose(withSearchRouter)(
  ({ urlQuery, urlSort, getSearchParams }) => {
    return (
      <div {...styles.container}>
        {SUPPORTED_SORT.filter(sort => urlQuery || !sort.needsQuery).map(
          (sort, key) => (
            <SortToggle
              key={key}
              sort={sort}
              urlSort={urlSort}
              getSearchParams={getSearchParams}
            />
          )
        )}
      </div>
    )
  }
)

export default Sort
