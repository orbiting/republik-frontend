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
    display: 'inline-block',
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
  render () {
    const { filterBucketKey, filterBucketValue, label, count, selected, onClickHander } = this.props
    return (
      <button
        {...styles.button}
        style={selected ? { backgroundColor: colors.primary, color: '#fff' } : {}}
        onClick={() => {
          onClickHander && onClickHander(filterBucketKey, !selected ? filterBucketValue : null)
        }}
      >
        {label}
        {count && <span {...styles.count}>{count}</span>}
      </button>
    )
  }
}

FilterButton.propTypes = {
  filterBucketKey: PropTypes.string.isRequired,
  filterBucketValue: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  selected: PropTypes.bool,
  onClickHander: PropTypes.func
}

FilterButton.defaultProps = {
  selected: false
}

class Filter extends Component {
  render () {
    const { onClickHander, filterBucketKey, filters } = this.props
    return (
      <div {...styles.container}>
        {filters.map(({key, label, count, selected}) => (
          <FilterButton
            key={key}
            filterBucketKey={filterBucketKey}
            filterBucketValue={key}
            selected={selected}
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
  filterBucketKey: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
      selected: PropTypes.bool
    })
  )
}

export default Filter
