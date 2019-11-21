import React, { Component } from 'react'
import { css } from 'glamor'

import { Router } from '../../lib/routes'
import track from '../../lib/piwik'

import { deserializeSort, serializeSort } from './serialize'

import Form from './Form'
import Filters from './Filters'
import Results from './Results'

import { Center, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '15px 15px 120px',
    [mediaQueries.mUp]: {
      padding: '40px 0 120px'
    }
  })
}

class Search extends Component {
  constructor(props, ...args) {
    super(props, ...args)

    this.state = {
      loading: false,
      searchQuery: '',
      submittedQuery: '',
      sort: {
        key: 'publishedAt'
      },
      serializedSort: '',
      totalCount: 0,
      isMobile: true,
      allowFocus: true,
      trackingId: undefined
    }

    this.onInputChange = (_, value) => {
      if (value === this.state.searchQuery) {
        return
      }
      this.setState({
        searchQuery: value,
        allowFocus: true
      })
    }

    this.refreshSearch = () => {
      const sort = {
        key: 'relevance'
      }
      this.setState({
        submittedQuery: this.state.searchQuery,
        sort,
        allowFocus: !this.state.isMobile
      })
      this.updateUrl(undefined, serializeSort(sort))
      track([
        'trackSiteSearch',
        this.state.searchQuery,
        false,
        this.state.totalCount
      ])
    }

    this.resetSearch = () => {
      this.clearUrl()
      this.setState({
        searchQuery: '',
        submittedQuery: '',
        allowFocus: true,
        preloadedAggregations: null
      })
    }

    this.onSubmit = e => {
      e.preventDefault()
      e.stopPropagation()
      this.refreshSearch()
    }

    this.onSearchLoaded = search => {
      const { trackingId } = search
      if (!!trackingId && trackingId !== this.state.trackingId) {
        this.setState({
          trackingId
        })
      }
    }

    this.onLoadMoreClick = () => {
      this.setState({
        allowFocus: false
      })
    }

    this.onSortClick = (sortKey, sortDirection) => {
      let sort = {
        key: sortKey
      }
      if (sortDirection) {
        sort.direction = sortDirection
      }
      const serializedSort = serializeSort(sort)
      this.setState({ sort, serializedSort })
      this.updateUrl(this.state.serializedFilters, serializedSort)
    }

    this.handleResize = () => {
      const isMobile = window.innerWidth < mediaQueries.mBreakPoint
      if (isMobile !== this.state.isMobile) {
        this.setState({ isMobile })
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    const { sort, trackingId } = this.state

    return (
      <Center {...styles.container}>
        <Form />
        <Filters />
        <Results
          sort={sort}
          onSortClick={this.onSortClick}
          onTotalCountLoaded={this.onTotalCountLoaded}
          onLoadMoreClick={this.onLoadMoreClick}
          onSearchLoaded={this.onSearchLoaded}
          trackingId={trackingId}
        />
      </Center>
    )
  }
}

export default Search
