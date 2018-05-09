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
        submittedQuery: this.state.searchQuery
      })
    }
  }

  render () {
    const { searchQuery, submittedQuery, sortKey, sortDirection } = this.state

    return (
      <div {...styles.container}>
        <Input
          value={searchQuery}
          onChange={(_, value) => this.setState({searchQuery: value})}
          onSearch={this.onSearch} />
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
