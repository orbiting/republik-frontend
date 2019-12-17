import React, { useState, useEffect } from 'react'
import withT from '../../lib/withT'
import Close from 'react-icons/lib/md/close'
import { Field } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { withAggregations } from './enhancers'
import { DEFAULT_AGGREGATION_KEYS } from './constants'
import InitState from './InitState'
import { useDebounce } from '../../lib/hooks/useDebounce'

const Form = compose(
  withSearchRouter,
  withAggregations,
  withT
)(
  ({
    urlQuery,
    updateUrlQuery,
    resetUrl,
    dataAggregations,
    t,
    searchQuery,
    setSearchQuery
  }) => {
    const [focusRef, setFocusRef] = useState(null)
    const [formValue, setFormValue] = useState(urlQuery)
    const [slowFormValue] = useDebounce(formValue, 200)

    useEffect(() => {
      focusRef && focusRef.input && focusRef.input.focus()
    }, [focusRef])

    useEffect(() => {
      setSearchQuery(slowFormValue)
    }, [slowFormValue])

    const submit = e => {
      e.preventDefault()
      formValue && formValue !== urlQuery && updateUrlQuery(formValue)
    }

    const update = (_, value) => {
      setFormValue(value)
    }

    const reset = () => {
      setFormValue(undefined)
      resetUrl()
    }

    return (
      <>
        <form onSubmit={submit}>
          <Field
            ref={setFocusRef}
            label={t('search/input/label')}
            value={formValue}
            onChange={update}
            icon={
              formValue && (
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
