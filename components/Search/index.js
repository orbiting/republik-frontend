import React, { Component } from 'react'
import { css } from 'glamor'
import debounce from 'lodash.debounce'

import { Router } from '../../lib/routes'

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

const DEFAULT_FILTERS = [
  {key: 'template', value: 'front', not: true}
]

const SUPPORTED_FILTER = {
  template: ['article', 'discussion', 'editorialNewsletter', 'format', 'dossier'],
  textLength: ['short', 'medium', 'long', 'epic'],
  type: ['Comment', 'User'],
  audio: ['true']
}

const SUPPORTED_SORT = {
  relevance: [],
  publishedAt: ['ASC', 'DESC']
}

const isSupportedFilter = filter => {
  return !!SUPPORTED_FILTER[filter.key] && SUPPORTED_FILTER[filter.key].indexOf(filter.value) !== -1
}

const deserializeFilters = filtersString => {
  return decodeURIComponent(filtersString)
    .split('|')
    .filter(filter => filter.split(':').length === 2)
    .map(filter => ({ key: filter.split(':')[0], value: filter.split(':')[1] }))
    .filter(filter => isSupportedFilter(filter))
}

const serializeFilters = filtersObject => {
  return filtersObject
    .map(filter => filter.key + encodeURIComponent(':') + filter.value)
    .join(encodeURIComponent('|'))
}

const deserializeSort = sortString => {
  const sortArray = decodeURIComponent(sortString).split(':')
  if (!SUPPORTED_SORT[sortArray[0]]) return

  let sort = {
    key: sortArray[0]
  }
  if (
    sortArray.length > 1 &&
    SUPPORTED_SORT[sortArray[0]].indexOf(sortArray[1]) !== -1
  ) {
    sort.direction = sortArray[1]
  }
  return sort
}

const serializeSort = sortObject => {
  const {key, direction} = sortObject
  return key + encodeURIComponent(':') + (direction || '')
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
      allowFocus: true
    }

    this.loadFilters = debounce(() => {
      this.setState({
        filterQuery: this.state.searchQuery,
        loadingFilters: false
      })
    }, 200)

    this.onInputChange = (_, value) => {
      this.setState({
        searchQuery: value,
        loadingFilters: true,
        allowFocus: true
      })
      this.loadFilters()
    }

    this.onSearch = () => {
      this.setState({
        submittedQuery: this.state.searchQuery,
        filterQuery: this.state.searchQuery,
        filters: DEFAULT_FILTERS,
        sort: {
          key: 'relevance'
        },
        allowFocus: !this.state.isMobile
      })
      this.updateUrl()
      window._paq.push(['trackSiteSearch',
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
        allowFocus: true
      })
    }

    this.onSubmit = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.onSearch()
    }

    this.onTotalCountLoaded = (totalCount) => {
      this.setState({
        totalCount
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

    this.onFilterClick = (filterBucketKey, filterBucketValue, selected) => {
      const filter = {
        key: filterBucketKey,
        value: filterBucketValue
      }

      let filters = [...this.state.filters].filter(
        filter => !(filter.key === 'template' && filter.value === 'front')
      )

      if (selected) {
        filters = filters.filter(filter => filter.key !== filterBucketKey && filter.value !== filterBucketValue)
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
        allowFocus: !this.state.isMobile
      })
      this.updateUrl(serializedFilters, this.state.serializedSort)
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

  componentWillReceiveProps (nextProps) {
    const { query } = nextProps.url

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
      filters,
      sort,
      loadingFilters,
      totalCount,
      allowFocus
    } = this.state

    return (
      <Center {...styles.container}>
        <form onSubmit={this.onSubmit}>
          <Input
            value={searchQuery}
            allowSearch={!!totalCount && searchQuery !== submittedQuery}
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
          onSearch={this.onSearch}
          onSortClick={this.onSortClick}
          onFilterClick={this.onFilterClick}
          onTotalCountLoaded={this.onTotalCountLoaded}
          onLoadMoreClick={this.onLoadMoreClick} />
      </Center>
    )
  }
}

export default Search
