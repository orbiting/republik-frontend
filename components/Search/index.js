import React, { Component } from 'react'
import { css } from 'glamor'

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
      allowFocus: true
    }

    this.refreshSearch = () => {
      this.setState({
        allowFocus: !this.state.isMobile
      })
    }

    // useWindowSize (check in iOS that it works)
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
