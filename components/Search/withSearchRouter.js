import React from 'react'
import { compose } from 'react-apollo'
import Router, { withRouter } from 'next/router'
import { DEFAULT_FILTER, DEFAULT_SORT } from './constants'

export const isDefaultFilter = filter =>
  filter.key === DEFAULT_FILTER.key && filter.value === DEFAULT_FILTER.value

const QUERY_PARAM = 'q'
const FILTER_KEY_PARAM = 'fkey'
const FILTER_VALUE_PARAM = 'fvalue'
const SORT_KEY_PARAM = 'skey'
const SORT_DIRECTION_PARAM = 'sdir'

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

    const updateURL = newQuery => {
      return Router.pushRoute('search', getCleanQuery(newQuery), {
        shallow: true
      })
    }

    const updateUrlQuery = q => updateURL({ [QUERY_PARAM]: q })

    const updateUrlFilter = filter => {
      return updateURL({
        [FILTER_KEY_PARAM]: filter.key,
        [FILTER_VALUE_PARAM]: filter.value
      })
    }

    const updateUrlSort = sort => {
      return updateURL({
        [SORT_KEY_PARAM]: sort.key,
        [SORT_DIRECTION_PARAM]: sort.direction
      })
    }

    const resetUrl = () => Router.pushRoute('search')

    const getCleanQuery = (newQuery = {}) => {
      const baseQuery = {
        ...query,
        ...newQuery
      }
      const cleanQuery = {}

      // support old query strings
      if (baseQuery.filters) {
        const filters = decodeURIComponent(baseQuery.filters).split(':')
        if (filters.length > 1) {
          cleanQuery[FILTER_KEY_PARAM] = filters[0]
          cleanQuery[FILTER_VALUE_PARAM] = filters[1]
        }
      }
      if (baseQuery.sort) {
        const sort = decodeURIComponent(baseQuery.sort).split(':')
        if (sort.length > 1) {
          cleanQuery[SORT_KEY_PARAM] = sort[0]
          cleanQuery[SORT_DIRECTION_PARAM] = sort[1]
        }
      }

      const defaultFilter = isDefaultFilter({
        key: baseQuery[FILTER_KEY_PARAM],
        value: baseQuery[FILTER_VALUE_PARAM]
      })
      const defaultSort = DEFAULT_SORT === baseQuery[SORT_KEY_PARAM]

      const transferKeys = [
        QUERY_PARAM,
        !defaultFilter && FILTER_KEY_PARAM,
        !defaultFilter && FILTER_VALUE_PARAM,
        !defaultSort && SORT_KEY_PARAM,
        !defaultSort && SORT_DIRECTION_PARAM
      ].filter(Boolean)
      transferKeys.forEach(key => {
        // prevent empty keys (leading to an tailing ? in the url)
        if (baseQuery[key]) {
          cleanQuery[key] = baseQuery[key]
        }
      })
      return cleanQuery
    }

    const cleanupUrl = () => {
      Router.replaceRoute('search', getCleanQuery(), { shallow: true })
    }

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
