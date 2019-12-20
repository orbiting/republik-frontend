import React from 'react'
import { compose } from 'react-apollo'
import Router, { withRouter } from 'next/router'
import {
  DEFAULT_FILTER,
  DEFAULT_SORT,
  FILTER_KEY_PARAM,
  FILTER_VALUE_PARAM,
  QUERY_PARAM,
  SORT_DIRECTION_PARAM,
  SORT_KEY_PARAM
} from './constants'

export const isDefaultFilter = filter =>
  filter.key === DEFAULT_FILTER.key && filter.value === DEFAULT_FILTER.value

export default WrappedComponent =>
  compose(withRouter)(({ router: { query }, ...props }) => {
    const urlQuery = query[QUERY_PARAM]
    const urlFilter = {
      key: query[FILTER_KEY_PARAM] || DEFAULT_FILTER.key,
      value: query[FILTER_VALUE_PARAM] || DEFAULT_FILTER.value
    }
    const urlSort = {
      key: query[SORT_KEY_PARAM] || DEFAULT_SORT,
      direction: query[SORT_DIRECTION_PARAM]
    }

    const updateURL = newParams => {
      return Router.pushRoute(
        'search',
        {
          ...Router.query,
          ...newParams
        },
        { shallow: true }
      )
    }

    const updateUrlQuery = q => updateURL({ [QUERY_PARAM]: q })

    const updateUrlFilter = filter => {
      const isDefault = isDefaultFilter(filter)
      return updateURL({
        [FILTER_KEY_PARAM]: isDefault ? undefined : filter.key,
        [FILTER_VALUE_PARAM]: isDefault ? undefined : filter.value
      })
    }

    const updateUrlSort = sort => {
      const isDefault = sort.key === DEFAULT_SORT
      return updateURL({
        [SORT_KEY_PARAM]: isDefault ? undefined : sort.key,
        [SORT_DIRECTION_PARAM]: isDefault ? undefined : sort.direction
      })
    }

    const resetUrl = () => Router.pushRoute('search')

    const cleanupUrl = () =>
      Router.replaceRoute(
        'search',
        {
          [QUERY_PARAM]: query[QUERY_PARAM],
          [FILTER_KEY_PARAM]: query[FILTER_KEY_PARAM],
          [FILTER_VALUE_PARAM]: query[FILTER_VALUE_PARAM],
          [SORT_KEY_PARAM]: query[SORT_KEY_PARAM],
          [SORT_DIRECTION_PARAM]: query[SORT_DIRECTION_PARAM]
        },
        { shallow: true }
      )

    return (
      <WrappedComponent
        urlQuery={urlQuery}
        urlFilter={urlFilter}
        urlSort={urlSort}
        updateUrlQuery={updateUrlQuery}
        updateUrlFilter={updateUrlFilter}
        updateUrlSort={updateUrlSort}
        resetUrl={resetUrl}
        cleanupUrl={cleanupUrl}
        {...props}
      />
    )
  })
