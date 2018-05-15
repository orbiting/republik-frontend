import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  button: css({
    ...fontStyles.sansSerifRegular18,
    display: 'inline-block',
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

export class FilterButton extends Component {
  render () {
    const { filterBucketKey, filterBucketValue, label, count, selected, onClickHander } = this.props
    if (!count) return null
    return (
      <button
        {...styles.button}
        style={selected ? { backgroundColor: colors.primary, color: '#fff' } : {}}
        onClick={() => {
          onClickHander && onClickHander(filterBucketKey, !selected ? filterBucketValue : null)
        }}
      >
        {label}
        <span {...styles.count}>{count}</span>
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

class FilterButtonGroup extends Component {
  render () {
    const { onClickHander, filterBucketKey, filters } = this.props
    return (
      <Fragment>
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
      </Fragment>
    )
  }
}

FilterButtonGroup.propTypes = {
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

export default FilterButtonGroup
