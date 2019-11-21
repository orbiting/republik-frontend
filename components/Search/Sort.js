import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import withT from '../../lib/withT'

import ArrowDown from 'react-icons/lib/md/arrow-downward'
import ArrowUp from 'react-icons/lib/md/arrow-upward'

import { colors, fontStyles, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    paddingTop: '3px'
  }),
  button: css({
    ...fontStyles.sansSerifRegular16,
    outline: 'none',
    color: colors.text,
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    marginRight: '17px',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular18,
      marginRight: '30px'
    }
  }),
  icon: css({
    display: 'inline-block',
    lineHeight: 0,
    verticalAlign: 'text-bottom'
  })
}

const SortPanel = ({ searchQuery, sort, totalCount, onSortClick }) => {
  return (
    <div>
      {totalCount > 1 && (
        <Sort
          sort={sort}
          searchQuery={searchQuery}
          onClickHandler={onSortClick}
        />
      )}
    </div>
  )
}

class SortButton extends Component {
  constructor(props, ...args) {
    super(props, ...args)

    this.state = {
      internalDirection: null
    }
  }

  render() {
    const {
      t,
      sortKey,
      label,
      direction,
      selected,
      onClickHandler
    } = this.props
    const { internalDirection } = this.state
    const resolvedDirection = internalDirection || direction
    const DirectionIcon =
      resolvedDirection === 'ASC'
        ? ArrowUp
        : resolvedDirection === 'DESC'
        ? ArrowDown
        : null
    const color = selected ? colors.primary : null

    return (
      <button
        {...styles.button}
        style={{ color }}
        onClick={() => {
          const toggledDirection = !selected
            ? resolvedDirection
            : resolvedDirection === 'ASC'
            ? 'DESC'
            : resolvedDirection === 'DESC'
            ? 'ASC'
            : null
          onClickHandler && onClickHandler(sortKey, toggledDirection)
          this.setState({
            internalDirection: toggledDirection
          })
        }}
      >
        {label}
        {DirectionIcon && (
          <span
            {...styles.icon}
            role='button'
            title={t(`search/sort/${resolvedDirection}/aria`)}
          >
            <DirectionIcon />
          </span>
        )}
      </button>
    )
  }
}

SortButton.propTypes = {
  sortKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  direction: PropTypes.oneOf(['ASC', 'DESC']),
  onClickHandler: PropTypes.func
}

SortButton.defaultProps = {
  selected: false
}

class Sort extends Component {
  render() {
    const { t, sort, onClickHandler } = this.props
    const sortKey = sort ? sort.key : 'publishedAt'
    const buttons = [
      {
        sortKey: 'publishedAt',
        label: 'Zeit',
        direction:
          sortKey === 'publishedAt' && sort.direction ? sort.direction : 'DESC',
        selected: sortKey === 'publishedAt'
      },
      {
        sortKey: 'relevance',
        label: 'Relevanz',
        selected: sortKey === 'relevance'
      }
    ]
    return (
      <div {...styles.container}>
        {buttons.map(({ sortKey, label, direction, selected }) => (
          <SortButton
            t={t}
            key={sortKey}
            sortKey={sortKey}
            selected={selected}
            label={label}
            direction={direction}
            onClickHandler={onClickHandler}
          />
        ))}
      </div>
    )
  }
}

Sort.propTypes = {
  sort: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['ASC', 'DESC'])
  }),
  searchQuery: PropTypes.string,
  onClickHandler: PropTypes.func
}

export default withT(Sort)
