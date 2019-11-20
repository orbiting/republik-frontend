import React from 'react'
import { compose } from 'react-apollo'
import Router, { withRouter } from 'next/router'
import { FILTER_KEY_PARAM, FILTER_VALUE_PARAM, QUERY_PARAM } from './constants'

export default WrappedComponent =>
  compose(withRouter)(({ router: { query }, ...props }) => {
    const searchQuery = query[QUERY_PARAM]
    const filter = query[FILTER_KEY_PARAM] && {
      key: query[FILTER_KEY_PARAM],
      value: query[FILTER_VALUE_PARAM]
    }

    const refreshQuery = newParams => {
      if (typeof document === 'undefined') return

      Router.push({
        pathname: '/suche',
        query: {
          ...query,
          ...newParams
        }
      })
    }
    const onSearchQueryChange = q => refreshQuery({ [QUERY_PARAM]: q })
    const onFilterChange = filter =>
      refreshQuery({
        [FILTER_KEY_PARAM]: filter.key,
        [FILTER_VALUE_PARAM]: filter.value
      })

    return (
      <WrappedComponent
        searchQuery={searchQuery}
        filter={filter}
        onSearchQueryChange={onSearchQueryChange}
        onFilterChange={onFilterChange}
        {...props}
      />
    )
  })
