import React, { Component } from 'react'
import { css } from 'glamor'
import debounce from 'lodash.debounce'

import { Router } from '../../lib/routes'
import track from '../../lib/piwik'

import { DEFAULT_FILTERS } from './constants'
import {
  deserializeFilters,
  serializeFilters,
  deserializeSort,
  serializeSort
} from './serialize'

import Input from './Input'
import Results from './Results'

import {
  Center,
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
      loading: false,
      loadingFilters: false,
      searchQuery: '',
      filterQuery: '',
      submittedQuery: '',
      filters: DEFAULT_FILTERS,
      serializedFilters: '',
      sort: {
        key: 'publishedAt'
      },
      serializedSort: '',
      totalCount: 0,
      isMobile: true,
      allowFocus: true,
      trackingId: undefined
    }

    this.loadFilters = debounce(() => {
      this.setState({
        filters:
          this.state.filterQuery !== this.state.searchQuery
            ? DEFAULT_FILTERS
            : this.state.filters,
        filterQuery: this.state.searchQuery,
        loadingFilters: false,
        preloadedAggregations: null
      })
    }, 200)

    this.onInputChange = (_, value) => {
      if (value === this.state.searchQuery) {
        return
      }
      this.setState({
        searchQuery: value,
        loadingFilters: true,
        allowFocus: true
      })
      this.loadFilters()
    }

    this.onSearch = () => {
      const sort = {
        key: 'relevance'
      }
      this.setState({
        submittedQuery: this.state.searchQuery,
        filterQuery: this.state.searchQuery,
        filters: DEFAULT_FILTERS,
        sort,
        allowFocus: !this.state.isMobile
      })
      this.updateUrl(undefined, serializeSort(sort))
      track(['trackSiteSearch',
        this.state.searchQuery,
        false,
        this.state.totalCount
      ])
    }

    this.onReset = () => {
      this.clearUrl()
      this.setState({
        searchQuery: '',
        submittedQuery: '',
        filterQuery: '',
        filters: DEFAULT_FILTERS,
        allowFocus: true,
        preloadedAggregations: null
      })
    }

    this.onSubmit = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.onSearch()
    }

    this.onSearchLoaded = (search) => {
      const { trackingId } = search
      if (!!trackingId && trackingId !== this.state.trackingId) {
        this.setState({
          trackingId
        })
      }
    }

    this.onTotalCountLoaded = (totalCount) => {
      this.setState({
        totalCount
      })
    }

    this.onAggregationsLoaded = (aggregations) => {
      this.setState({
        preloadedAggregations: aggregations
      })
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
      this.setState({sort, serializedSort})
      this.updateUrl(this.state.serializedFilters, serializedSort)
    }

    this.onFilterClick = (filterBucketKey, filterBucketValue, selected, count) => {
      const filter = {
        key: filterBucketKey,
        value: filterBucketValue
      }

      let filters = [...this.state.filters].filter(
        filter => !(filter.key === 'template' && filter.value === 'front')
      )

      if (selected) {
        filters = filters.filter(filter => filter.key !== filterBucketKey)
      } else {
        if (!filters.find(filter => filter.key === filterBucketKey && filter.value === filterBucketValue)) {
          filters.push(filter)
        }
      }

      const serializedFilters = serializeFilters(filters)
      this.setState({
        filters: filters.concat(DEFAULT_FILTERS),
        serializedFilters,
        submittedQuery: this.state.searchQuery,
        filterQuery: this.state.searchQuery,
        allowFocus: !this.state.isMobile,
        preloadedAggregations: null
      })
      this.updateUrl(serializedFilters, this.state.serializedSort)
      if (!selected) {
        track(['trackSiteSearch',
          this.state.searchQuery,
          decodeURIComponent(serializedFilters),
          count
        ])
      }
    }

    this.pushUrl = (params) => {
      Router.replaceRoute(
        'search',
        params,
        { shallow: true }
      )
    }

    this.updateUrl = (filters, sort) => {
      const searchQuery = encodeURIComponent(this.state.searchQuery)
      this.pushUrl({q: searchQuery, filters, sort})
    }

    this.clearUrl = () => {
      this.pushUrl({})
    }

    this.handleResize = () => {
      const isMobile = window.innerWidth < mediaQueries.mBreakPoint
      if (isMobile !== this.state.isMobile) {
        this.setState({isMobile})
      }
    }
  }

  componentWillReceiveProps ({ query }) {
    let filters = DEFAULT_FILTERS
    let newState = {}
    const decodedQuery = !!query.q && decodeURIComponent(query.q)

    if (decodedQuery && decodedQuery !== this.state.searchQuery) {
      newState = {
        ...newState,
        searchQuery: decodedQuery,
        submittedQuery: decodedQuery,
        filterQuery: decodedQuery
      }
    }

    if (query.filters) {
      const rawFilters = typeof query.filters === 'string' ? query.filters : query.filters[0]
      const sanitizedFilters = deserializeFilters(rawFilters)
      const serializedFilters = serializeFilters(sanitizedFilters)

      if (serializedFilters !== this.state.serializedFilters) {
        newState = {
          ...newState,
          filters: filters.concat(sanitizedFilters),
          serializedFilters
        }
      }
    }

    if (query.sort) {
      const rawSort = typeof query.sort === 'string' ? query.sort : query.sort[0]
      const sanitizedSort = deserializeSort(rawSort)
      const serializedSort = serializeSort(sanitizedSort)

      if (serializedSort !== this.state.serializedSort) {
        newState = {
          ...newState,
          sort: sanitizedSort,
          serializedSort
        }
      }
    }

    if (newState.submittedQuery || newState.filters || newState.sort) {
      this.setState(newState)
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const {
      searchQuery,
      filterQuery,
      submittedQuery,
      preloadedAggregations,
      totalCount,
      filters,
      sort,
      loadingFilters,
      allowFocus,
      trackingId
    } = this.state

    return (
      <Center {...styles.container}>
        <form onSubmit={this.onSubmit}>
          <Input
            value={searchQuery}
            allowSearch={searchQuery !== submittedQuery}
            allowFocus={allowFocus}
            onChange={this.onInputChange}
            onSearch={this.onSearch}
            onReset={this.onReset}
          />
        </form>
        <Results
          searchQuery={submittedQuery}
          filterQuery={filterQuery}
          sort={sort}
          loadingFilters={loadingFilters}
          filters={filters}
          preloadedTotalCount={totalCount}
          preloadedAggregations={preloadedAggregations}
          onSearch={this.onSearch}
          onSortClick={this.onSortClick}
          onFilterClick={this.onFilterClick}
          onTotalCountLoaded={this.onTotalCountLoaded}
          onAggregationsLoaded={this.onAggregationsLoaded}
          onLoadMoreClick={this.onLoadMoreClick}
          onSearchLoaded={this.onSearchLoaded}
          trackingId={trackingId} />
      </Center>
    )
  }
}

export default Search
