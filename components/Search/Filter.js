import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { DEFAULT_FILTERS } from './'
import Loader from '../../components/Loader'

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

const getSearchAggregations = gql`
query getSearchAggregations(
    $search: String,
    $filters: [SearchGenericFilterInput!]) {
  search(
      first: 100,
      search: $search,
      filters: $filters) {
    aggregations {
      key
      count
      label
      buckets {
        value
        count
        label
      }
    }
  }
}
`

class Filter extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      // TODO: Remember last selected filter?
    }
  }

  render () {
    const { data, filters, onFilterClick } = this.props

    return (
      <div {...styles.container}>
        <Loader
          loading={data.loading}
          error={data.error}
          render={() => {
            const { data } = this.props
            const { search } = data

            const aggregations = search.aggregations

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
                )
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
              <Fragment>
                <FilterButtonGroup
                  filterBucketKey='template'
                  filters={templateFilters}
                  onClickHander={onFilterClick} />
                <FilterButtonGroup
                  filterBucketKey='type'
                  filters={typeFilters}
                  onClickHander={onFilterClick} />
                <FilterButtonGroup
                  filterBucketKey='textLength'
                  filters={textLengthFilters}
                  onClickHander={onFilterClick} />
                <FilterButton
                  filterBucketKey='audio'
                  filterBucketValue='true'
                  label={aggregation.audio.label}
                  count={aggregation.audio.count}
                  selected={!!filters.find(filter => filter.key === 'audio')}
                  onClickHander={onFilterClick} />
              </Fragment>
            )
          }}
        />
      </div>
    )
  }
}

export default compose(
  graphql(getSearchAggregations, {
    options: props => ({
      variables: {
        search: props.searchQuery,
        filters: DEFAULT_FILTERS
      }
    })
  })
)(Filter)
