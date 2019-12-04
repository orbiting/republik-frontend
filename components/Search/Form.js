import React, { useState, useEffect } from 'react'
import withT from '../../lib/withT'

import Close from 'react-icons/lib/md/close'

import { Field } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { withAggregations } from './enhancers'
import { DEFAULT_AGGREGATION_KEYS } from './constants'
import { preselectFilter } from './Filters'

const Form = compose(
  withSearchRouter,
  withAggregations,
  withT
)(
  ({
    urlQuery,
    urlTrackingId,
    updateUrlQuery,
    updateUrlFilter,
    updateUrlTrackingId,
    resetUrl,
    dataAggregations,
    t,
    searchQuery,
    setSearchQuery
  }) => {
    const [focusRef, setFocusRef] = useState(null)

    useEffect(() => {
      focusRef && focusRef.input && focusRef.input.focus()
      return
    }, [focusRef])

    const updateTrackingId = () => {
      const trackingId =
        dataAggregations.search && dataAggregations.search.trackingId
      trackingId &&
        trackingId !== urlTrackingId &&
        updateUrlTrackingId(trackingId)
    }

    const submitForm = e => {
      e.preventDefault()
      if (!searchQuery && searchQuery === urlQuery) return

      updateUrlQuery(searchQuery).then(() =>
        updateUrlFilter(preselectFilter(dataAggregations))
      )
      // updateTrackingId()
    }

    const update = (_, value) => {
      setSearchQuery(value)
    }

    const reset = () => {
      setSearchQuery(undefined)
      resetUrl()
    }

    return (
      <form onSubmit={e => submitForm(e)}>
        <Field
          ref={setFocusRef}
          label={t('search/input/label')}
          value={searchQuery}
          onChange={update}
          icon={
            searchQuery && (
              <Close style={{ cursor: 'pointer' }} size={30} onClick={reset} />
            )
          }
        />
      </form>
    )
  }
)

const FormWrapper = compose(withSearchRouter)(({ urlQuery }) => {
  const [searchQuery, setSearchQuery] = useState(urlQuery)

  return (
    <Form
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      keys={DEFAULT_AGGREGATION_KEYS}
    />
  )
})

export default FormWrapper
