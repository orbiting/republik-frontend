import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import ArrowDown from 'react-icons/lib/md/arrow-downward'
import ArrowUp from 'react-icons/lib/md/arrow-upward'

import {
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    borderTop: `1px solid ${colors.text}`,
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

const SortInputs = [
  {
    sortKey: 'publishedAt',
    label: 'Zeit',
    direction: 'DESC'
  },
  {
    sortKey: 'relevance',
    label: 'Relevanz'

  }
  // TODO: enable these sort keys once backend supports them.
  /*
  {
    sortKey: 'mostRead',
    label: 'meistgelesen'
  },
  {
    sortKey: 'mostDebated',
    label: 'meistdebattiert'
  } */
]

class SortButton extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      direction: props.direction
    }
  }

  render () {
    const { sortKey, label, selected, onClickHander } = this.props
    const { direction } = this.state
    const DirectionIcon =
      direction === 'ASC' ? ArrowUp : direction === 'DESC' ? ArrowDown : null
    return (
      <button
        {...styles.button}
        style={selected ? { color: colors.primary } : {}}
        onClick={() => {
          const toggledDirection = !selected
            ? direction
            : direction === 'ASC' ? 'DESC' : direction === 'DESC' ? 'ASC' : null
          onClickHander && onClickHander(sortKey, toggledDirection)
          this.setState({
            direction: toggledDirection
          })
        }}
      >
        {label}
        {DirectionIcon && (
          <span {...styles.icon}>
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
  onClickHander: PropTypes.func
}

SortButton.defaultProps = {
  selected: false
}

class Sort extends Component {
  render () {
    const { onClickHander, selectedKey } = this.props
    return (
      <div {...styles.container}>
        {SortInputs.map(({sortKey, label, direction}) => (
          <SortButton
            key={sortKey}
            sortKey={sortKey}
            selected={selectedKey === sortKey}
            label={label}
            direction={direction && (this.props.direction || direction)}
            onClickHander={onClickHander} />
        ))}
      </div>
    )
  }
}

Sort.propTypes = {
  onClickHander: PropTypes.func,
  selectedKey: PropTypes.string,
  direction: PropTypes.oneOf(['ASC', 'DESC'])
}

export default Sort
