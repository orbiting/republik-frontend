import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import {
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    position: 'relative'
  }),
  compact: css({
    [mediaQueries.onlyS]: {
      whiteSpace: 'nowrap',
      overflow: 'auto'
    }
  }),
  fadeout: css({
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,1) 100%)',
    bottom: 0,
    display: 'none',
    position: 'absolute',
    right: '-1px',
    top: 0,
    width: 15,
    [mediaQueries.onlyS]: {
      display: 'block'
    }
  }),
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
    const {
      filterBucketKey,
      filterBucketValue,
      label,
      count,
      selected,
      onClickHandler,
      loadingFilters
    } = this.props
    if (!count) return null
    const visibility = loadingFilters ? 'hidden' : 'visible'
    return (
      <button
        {...styles.button}
        style={selected ? { backgroundColor: colors.primary, color: '#fff' } : {}}
        onClick={() => {
          onClickHandler && onClickHandler(filterBucketKey, filterBucketValue, selected, count)
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
  onClickHandler: PropTypes.func,
  loadingFilters: PropTypes.bool
}

FilterButton.defaultProps = {
  selected: false
}

class FilterButtonGroup extends Component {
  render () {
    const { filterBucketKey, filters } = this.props
    return (
      <Fragment>
        {filters.map(({key, label, count, selected, loadingFilters, onClickHandler}) => (
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
  render () {
    const {
      aggregations,
      filters,
      onClickHandler,
      loadingFilters,
      allowCompact
    } = this.props

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
        onClickHandler,
        loadingFilters
      }
    }

    const templateFilters =
      aggregation.template &&
      aggregation.template.buckets.map(bucket =>
        filterButtonProps('template', bucket)
      )

    const kindFilters =
      aggregation.kind &&
      aggregation.kind.buckets
        .filter(
          bucket => bucket.value !== 'editorial'
        )
        .map(bucket => filterButtonProps('kind', bucket))

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

    const booleanFilterButtonProps = aggregation => {
      return {
        filterBucketKey: aggregation.key,
        filterBucketValue: 'true',
        label: aggregation.label,
        count: aggregation.count,
        selected: !!filters.find(filter => filter.key === aggregation.key),
        onClickHandler,
        loadingFilters
      }
    }

    return (
      <div {...styles.container}>
        <div {...(allowCompact ? styles.compact : {})}>
          <FilterButtonGroup
            filterBucketKey='template'
            filters={templateFilters} />
          <FilterButton {...(booleanFilterButtonProps(aggregation.isSeriesMaster))} />
          <FilterButtonGroup
            filterBucketKey='kind'
            filters={kindFilters} />
          <FilterButtonGroup
            filterBucketKey='type'
            filters={typeFilters} />
          <FilterButtonGroup
            filterBucketKey='textLength'
            filters={textLengthFilters} />
          <FilterButton {...(booleanFilterButtonProps(aggregation.audioSource))} />
          <FilterButton {...(booleanFilterButtonProps(aggregation.hasAudio))} />
          <FilterButton {...(booleanFilterButtonProps(aggregation.hasVideo))} />
        </div>
        {allowCompact && (
          <div {...styles.fadeout} />
        )}
      </div>
    )
  }
}

Filter.propTypes = {
  aggregations: PropTypes.array,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      not: PropTypes.bool
    })
  ),
  onClickHandler: PropTypes.func,
  loadingFilters: PropTypes.bool,
  allowCompact: PropTypes.bool
}

export default Filter
