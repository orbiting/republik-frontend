import React, { Component } from 'react'
import { css } from 'glamor'

import { Router } from '../../lib/routes'

import Input from './Input'
import Results from './Results'

import {
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    marginBottom: 50,
    [mediaQueries.mUp]: {
      marginBottom: 60
    }
  })
}

const DEFAULT_FILTER = {key: 'template', value: 'front', not: true}

class Search extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      loading: false,
      searchQuery: '',
      submittedQuery: '',
      filters: [DEFAULT_FILTER],
      sort: {
        key: 'publishedAt'
      }
    }

    this.onSearch = () => {
      this.props.showFeed(false)
      this.updateUrl()
      this.setState({
        submittedQuery: this.state.searchQuery,
        filters: [DEFAULT_FILTER],
        sort: {
          key: 'relevance'
        }
      })
    }

    this.onReset = () => {
      this.props.showFeed(true)
      this.clearUrl()
      this.setState({
        searchQuery: '',
        submittedQuery: '',
        filters: [DEFAULT_FILTER]
      })
    }

    this.onClose = () => {
      this.props.showFeed(true)
      this.pushUrl({})
    }

    this.onSubmit = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.onSearch()
    }

    this.onSortClick = (sortKey, sortDirection) => {
      let sort = {
        key: sortKey
      }
      if (sortDirection) {
        sort.direction = sortDirection
      }
      this.setState({sort})
    }

    this.onFilterClick = (filterBucketKey, filterBucketValue) => {
      const filter = filterBucketValue && {
        key: filterBucketKey,
        value: filterBucketValue
      }
      let filters = [DEFAULT_FILTER]
      if (filter) {
        filters.push(filter)
      }

      // TODO: Preserve text length filter when available.
      this.setState({
        filters
      })
      if (this.state.submittedQuery === '') {
        this.props.showFeed && this.props.showFeed(filters.length > 1)
      }
      filter && this.props.showFeed && this.props.showFeed(false)
    }

    this.pushUrl = (params) => {
      Router.replaceRoute(
        'feed',
        params,
        { shallow: true }
      )
    }

    this.updateUrl = (filter) => {
      const searchQuery = this.state.searchQuery
      this.pushUrl({search: searchQuery})
    }

    this.clearUrl = () => {
      this.pushUrl({search: ''})
    }
  }

  componentWillReceiveProps (nextProps) {
    const { query } = nextProps.url

    if (query.search && query.search !== this.state.searchQuery) {
      this.props.showFeed && this.props.showFeed(false)
      this.setState({
        searchQuery: query.search,
        submittedQuery: query.search,
        filters: [DEFAULT_FILTER]
      })
    }
  }

  render () {
    const { searchQuery, submittedQuery, filters, sort } = this.state

    const dirty = searchQuery !== submittedQuery

    return (
      <div {...styles.container}>
        <form onSubmit={this.onSubmit}>
          <Input
            value={searchQuery}
            dirty={dirty}
            onChange={(_, value) => this.setState({searchQuery: value})}
            onSearch={this.onSearch}
            onReset={this.onReset}
            onClose={this.onClose}
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
