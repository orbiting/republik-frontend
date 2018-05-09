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
      filterKey: null,
      sortDirection: null,
      sortKey: 'relevance'
    }

    this.onSortClick = (sortKey, sortDirection) => {
      this.setState({
        sortKey: sortKey,
        sortDirection: sortDirection
      })
    }

    this.onSearch = () => {
      this.props.onSearch(true)
      this.setState({
        dirty: false,
        submittedQuery: this.state.searchQuery
      })
    }

    this.onReset = () => {
      this.props.onSearch(false)
      this.setState({
        dirty: false,
        searchQuery: '',
        submittedQuery: ''
      })
    }

    this.onSubmit = (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.onSearch()
    }
  }

  render () {
    const { searchQuery, submittedQuery, dirty, sortKey, sortDirection } = this.state

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
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortClick={this.onSortClick} />
      </div>
    )
  }
}

export default Search
