import React, { Component } from 'react'
import { css } from 'glamor'

import Input from './Input'
import Results from './Results'

import {
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '15px 15px 120px',
    [mediaQueries.mUp]: {
      padding: '40px 0 120px'
    }
  })
}

class Search extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      dirty: true,
      loading: false,
      searchQuery: '',
      submittedQuery: '',
      filters: [],
      sort: {
        key: 'relevance'
      }
    }

    this.onSearch = () => {
      this.props.onSearch(true)
      this.setState({
        dirty: false,
        submittedQuery: this.state.searchQuery,
        filters: []
      })
    }

    this.onReset = () => {
      this.props.onSearch(false)
      this.setState({
        dirty: false,
        searchQuery: '',
        submittedQuery: '',
        filters: []
      })
    }

    this.onSubmit = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.onSearch()
    }

    this.onSortClick = (sortKey, sortDirection) => {
      this.setState({
        sort: {
          key: sortKey,
          direction: sortDirection
        }
      })
    }

    this.onFilterClick = (filterBucketKey, filterBucketValue) => {
      const filters = filterBucketValue ? [
        {
          key: filterBucketKey,
          value: filterBucketValue
        }
      ] : []

      // TODO: Preserve text length filter when available.
      this.setState({
        filters
      })
    }
  }

  render () {
    const { searchQuery, submittedQuery, dirty, filters, sort } = this.state

    return (
      <div {...styles.container}>
        <form onSubmit={this.onSubmit}>
          <Input
            value={searchQuery}
            dirty={dirty}
            onChange={(_, value) => this.setState({dirty: true, searchQuery: value})}
            onSearch={this.onSearch}
            onReset={this.onReset}
          />
        </form>
        <Results
          searchQuery={submittedQuery}
          sort={sort}
          filters={filters}
          onSortClick={this.onSortClick}
          onFilterClick={this.onFilterClick} />
      </div>
    )
  }
}

export default Search
