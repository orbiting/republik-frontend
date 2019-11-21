import React, { Component } from 'react'
import { css } from 'glamor'

import { Router } from '../../lib/routes'
import track from '../../lib/piwik'

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

    this.refreshSearch = () => {
      this.setState({
        allowFocus: !this.state.isMobile
      })
      track([
        'trackSiteSearch',
        this.state.searchQuery,
        false,
        this.state.totalCount
      ])
    }

    this.onSearchLoaded = search => {
      const { trackingId } = search
      if (!!trackingId && trackingId !== this.state.trackingId) {
        this.setState({
          trackingId
        })
      }
    }

    this.onSortClick = (sortKey, sortDirection) => {
      let sort = {
        key: sortKey
      }
      if (sortDirection) {
        sort.direction = sortDirection
      }
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
    return (
      <Center {...styles.container}>
        <Form />
        <Filters />
        <Results />
      </Center>
    )
  }
}

export default Search
