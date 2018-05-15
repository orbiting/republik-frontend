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

class Search extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      loading: false,
      searchQuery: '',
      submittedQuery: '',
      filters: [],
      sort: {
        key: 'publishedAt'
      }
    }

    this.onSearch = () => {
      this.props.showFeed(false)
      this.updateUrl()
      this.setState({
        submittedQuery: this.state.searchQuery,
        filters: [],
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
        filters: []
      })
    }

    this.onClose = () => {
      this.props.showFeed(true)
      this.pushUrl(this.props.url.pathname)
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
      if (this.state.submittedQuery === '') {
        this.props.showFeed && this.props.showFeed(!filters.length)
      }
    }

    this.pushUrl = (href) => {
      const as = href
      Router.push(href, as, { shallow: true })
    }

    this.updateUrl = () => {
      const searchQuery = this.state.searchQuery
      const href = this.props.url.pathname + (searchQuery ? '?search=' + searchQuery : '')
      this.pushUrl(href)
    }

    this.clearUrl = () => {
      const href = this.props.url.pathname + '?search='
      this.pushUrl(href)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { query } = nextProps.url

    if (query.search && query.search !== this.state.searchQuery) {
      this.props.showFeed && this.props.showFeed(false)
      this.setState({
        searchQuery: query.search,
        submittedQuery: query.search,
        filters: []
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
