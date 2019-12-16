import React, { useState, useEffect } from 'react'
import withT from '../../lib/withT'

import Close from 'react-icons/lib/md/close'

import { Field } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter, { isDefaultFilter } from './withSearchRouter'
import { withAggregations } from './enhancers'
import { DEFAULT_AGGREGATION_KEYS } from './constants'
import { preselectFilter } from './Filters'
import track from '../../lib/piwik'
import InitState from './InitState'

const trackSearch = (query, data) => {
  if (data.loading || data.error) return
  const totalCount = data.search && data.search.totalCount
  track(['trackSiteSearch', query, false, totalCount])
}

const Form = compose(
  withSearchRouter,
  withAggregations,
  withT
)(
  ({
    urlQuery,
    updateUrlQuery,
    urlFilter,
    updateUrlFilter,
    resetUrl,
    dataAggregations,
    t,
    searchQuery,
    setSearchQuery
  }) => {
    const [focusRef, setFocusRef] = useState(null)

    useEffect(() => {
      focusRef && focusRef.input && focusRef.input.focus()
    }, [focusRef])

    useEffect(() => {
      trackSearch(urlQuery, dataAggregations)
    }, [urlQuery])

    const updateFilter = () =>
      isDefaultFilter(urlFilter) &&
      updateUrlFilter(preselectFilter(dataAggregations))

    const submit = e => {
      e.preventDefault()
      searchQuery &&
        searchQuery !== urlQuery &&
        updateUrlQuery(searchQuery).then(updateFilter)
    }

    const update = (_, value) => {
      setSearchQuery(value)
    }

    const reset = () => {
      setSearchQuery(undefined)
      resetUrl()
    }

    return (
      <>
        <form onSubmit={submit}>
          <Field
            ref={setFocusRef}
            label={t('search/input/label')}
            value={searchQuery}
            onChange={update}
            icon={
              searchQuery && (
                <Close
                  style={{ cursor: 'pointer' }}
                  size={30}
                  onClick={reset}
                />
              )
            }
          />
        </form>
        {!urlQuery && (
          <InitState query={searchQuery} dataAggregations={dataAggregations} />
        )}
      </>
    )
  }
)

const FormWrapper = compose(withSearchRouter)(({ urlQuery, urlFilter }) => {
  const [searchQuery, setSearchQuery] = useState(urlQuery)

  return (
    <Form
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      keys={DEFAULT_AGGREGATION_KEYS}
      urlFilter={urlFilter}
    />
  )
})

export default FormWrapper
