import React, { Component } from 'react'
import { css } from 'glamor'

import track from '../../lib/piwik'

import Form from './Form'
import Filters from './Filters'
import Sort from './Sort'
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
      isMobile: true,
      allowFocus: true,
      trackingId: undefined
    }

    this.refreshSearch = () => {
      this.setState({
        allowFocus: !this.state.isMobile
      })
      // TODO: handle this in the results component
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
        <Sort />
        <Results />
      </Center>
    )
  }
}

export default Search
