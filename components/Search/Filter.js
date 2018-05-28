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

class FilterButton extends Component {
  render () {
    const { filterBucketKey, filterBucketValue, label, count, selected, onClickHandler, loadingFilters } = this.props
    if (!count) return null
    const visibility = loadingFilters ? 'hidden' : 'visible'
    return (
      <button
        {...styles.button}
        style={selected ? { backgroundColor: colors.primary, color: '#fff' } : {}}
        onClick={() => {
          onClickHandler && onClickHandler(filterBucketKey, filterBucketValue, selected)
        }}
      >
        {label}
        <span {...styles.count} style={{visibility}}>{count}</span>
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
  onClickHandler: PropTypes.func
}

FilterButton.defaultProps = {
  selected: false
}

class FilterButtonGroup extends Component {
  render () {
    const { onClickHandler, filterBucketKey, filters } = this.props
    return (
      <Fragment>
        {filters.map(({key, label, count, selected, loadingFilters}) => (
          <FilterButton
            key={key}
            filterBucketKey={filterBucketKey}
            filterBucketValue={key}
            selected={selected}
            label={label}
            count={count}
            onClickHandler={onClickHandler}
            loadingFilters={loadingFilters} />
        ))}
      </Fragment>
    )
  }
}

FilterButtonGroup.propTypes = {
  onClickHandler: PropTypes.func,
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

class Filter extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      // TODO: Remember last selected filter?
    }
  }

  render () {
    const { aggregations, filters, onFilterClick, loadingFilters } = this.props

    if (!aggregations) {
      return null
    }

    const aggregation = aggregations ? aggregations.reduce((map, obj) => {
      map[obj.key] = obj
      return map
    }, {}) : {}

    const filterButtonProps = (key, bucket) => {
      return {
        key: bucket.value,
        label: bucket.label,
        count: bucket.count,
        selected: !!filters.find(
          filter => filter.key === key && filter.value === bucket.value
        ),
        loadingFilters
      }
    }

    const templateFilters =
      aggregation.template &&
      aggregation.template.buckets.map(bucket =>
        filterButtonProps('template', bucket)
      )

    const typeFilters =
      aggregation.type &&
      aggregation.type.buckets
        .filter(
          bucket => bucket.value !== 'Document' && bucket.value !== 'Credential'
        )
        .map(bucket => filterButtonProps('type', bucket))

    const textLengthFilters =
      aggregation.textLength &&
      aggregation.textLength.buckets.map(bucket =>
        filterButtonProps('textLength', bucket)
      )

    return (
      <div {...styles.container}>
        <Fragment>
          <FilterButtonGroup
            filterBucketKey='template'
            filters={templateFilters}
            onClickHandler={onFilterClick} />
          <FilterButtonGroup
            filterBucketKey='type'
            filters={typeFilters}
            onClickHandler={onFilterClick} />
          <FilterButtonGroup
            filterBucketKey='textLength'
            filters={textLengthFilters}
            onClickHandler={onFilterClick} />
          <FilterButton
            filterBucketKey='audio'
            filterBucketValue='true'
            label={aggregation.audio.label}
            count={aggregation.audio.count}
            selected={!!filters.find(filter => filter.key === 'audio')}
            onClickHandler={onFilterClick}
            loadingFilters={loadingFilters} />
        </Fragment>
      </div>
    )
  }
}

export default Filter
