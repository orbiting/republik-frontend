import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    padding: 0
  }),
  button: css({
    ...fontStyles.sansSerifRegular18,
    outline: 'none',
    color: colors.text,
    WebkitAppearance: 'none',
    background: '#f2f2f2',
    border: 'none',
    padding: '1px 10px 2px 10px',
    cursor: 'pointer',
    margin: '0 10px 10px 0',
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  }),
  count: css({
    ...fontStyles.sansSerifMedium14,
    marginLeft: 5,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium16
    }
  })
}

class FilterButton extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      selected: false
    }
  }

  render () {
    const { filterKey, label, count, onClickHander } = this.props
    const { selected } = this.state
    return (
      <button
        {...styles.button}
        style={selected ? { backgroundColor: colors.primary, color: '#fff' } : {}}
        onClick={() => {
          onClickHander && onClickHander(filterKey)
          this.setState({
            selected: !selected
          })
        }}
      >
        {label}
        <span {...styles.count}>{count}</span>
      </button>
    )
  }
}

FilterButton.propTypes = {
  filterKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClickHander: PropTypes.func
}

FilterButton.defaultProps = {
  selected: false
}

class Filter extends Component {
  render () {
    const { onClickHander, selectedKey, filters } = this.props
    return (
      <div {...styles.container}>
        {filters.map(({key, label, count}) => (
          <FilterButton
            key={key}
            filterKey={key}
            selected={selectedKey === key}
            label={label}
            count={count}
            onClickHander={onClickHander} />
        ))}
      </div>
    )
  }
}

Filter.propTypes = {
  onClickHander: PropTypes.func,
  selectedKey: PropTypes.string
}

export default Filter
