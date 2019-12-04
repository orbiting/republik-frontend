import React from 'react'
import { compose } from 'react-apollo'
import Router, { withRouter } from 'next/router'
import {
  DEFAULT_FILTER,
  FILTER_KEY_PARAM,
  FILTER_VALUE_PARAM,
  QUERY_PARAM,
  SORT_DIRECTION_PARAM,
  SORT_KEY_PARAM,
  TRACKING_PARAM
} from './constants'

export default WrappedComponent =>
  compose(withRouter)(({ router: { query }, ...props }) => {
    const urlQuery = query[QUERY_PARAM]
    const urlFilter = {
      key: query[FILTER_KEY_PARAM] || DEFAULT_FILTER.key,
      value: query[FILTER_VALUE_PARAM] || DEFAULT_FILTER.value
    }
    const urlSort = query[SORT_KEY_PARAM] && {
      key: query[SORT_KEY_PARAM],
      direction: query[SORT_DIRECTION_PARAM]
    }
    const urlTrackingId = query[TRACKING_PARAM]

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
      const isDefault =
        filter.key === DEFAULT_FILTER.key &&
        filter.value === DEFAULT_FILTER.value
      return updateURL({
        [FILTER_KEY_PARAM]: isDefault ? undefined : filter.key,
        [FILTER_VALUE_PARAM]: isDefault ? undefined : filter.value
      })
    }

    const updateUrlSort = sort =>
      updateURL({
        [SORT_KEY_PARAM]: sort.key,
        [SORT_DIRECTION_PARAM]: sort.direction
      })

    const updateUrlTrackingId = trackingId =>
      updateURL({ [TRACKING_PARAM]: trackingId })

    const resetUrl = () => Router.pushRoute('search')

    return (
      <WrappedComponent
        urlQuery={urlQuery}
        urlFilter={urlFilter}
        urlSort={urlSort}
        urlTrackingId={urlTrackingId}
        updateUrlQuery={updateUrlQuery}
        updateUrlFilter={updateUrlFilter}
        updateUrlSort={updateUrlSort}
        updateUrlTrackingId={updateUrlTrackingId}
        resetUrl={resetUrl}
        {...props}
      />
    )
  })
