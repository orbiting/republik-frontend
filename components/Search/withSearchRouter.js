import React from 'react'
import { compose } from 'react-apollo'
import Router, { withRouter } from 'next/router'
import {
  FILTER_KEY_PARAM,
  FILTER_VALUE_PARAM,
  QUERY_PARAM,
  SORT_DIRECTION_PARAM,
  SORT_KEY_PARAM
} from './constants'

export default WrappedComponent =>
  compose(withRouter)(({ router: { query }, ...props }) => {
    const searchQuery = query[QUERY_PARAM]
    const filter = query[FILTER_KEY_PARAM] && {
      key: query[FILTER_KEY_PARAM],
      value: query[FILTER_VALUE_PARAM]
    }
    const sort = query[SORT_KEY_PARAM] && {
      key: query[SORT_KEY_PARAM],
      direction: query[SORT_DIRECTION_PARAM]
    }

    const updateURL = newParams => {
      Router.pushRoute(
        'search',
        {
          ...query,
          ...newParams
        },
        { shallow: true }
      )
    }
    const onSearchQueryChange = q => updateURL({ [QUERY_PARAM]: q })
    const onFilterChange = filter =>
      updateURL({
        [FILTER_KEY_PARAM]: filter.key,
        [FILTER_VALUE_PARAM]: filter.value
      })
    const onSortChange = sort =>
      updateURL({
        [SORT_KEY_PARAM]: sort.key,
        [SORT_DIRECTION_PARAM]: sort.direction
      })

    const resetURL = () => Router.pushRoute('search')

    return (
      <WrappedComponent
        searchQuery={searchQuery}
        filter={filter}
        sort={sort}
        onSearchQueryChange={onSearchQueryChange}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        resetURL={resetURL}
        {...props}
      />
    )
  })
