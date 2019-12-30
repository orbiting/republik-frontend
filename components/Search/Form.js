import React, { useState, useEffect } from 'react'
import withT from '../../lib/withT'
import Close from 'react-icons/lib/md/close'
import { Field, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { withAggregations } from './enhancers'
import { DEFAULT_AGGREGATION_KEYS, DEFAULT_SORT } from './constants'
import LiveState from './LiveState'
import { useDebounce } from '../../lib/hooks/useDebounce'
import { css } from 'glamor'

const styles = css({
  paddingTop: 15,
  [mediaQueries.mUp]: {
    paddingTop: 40
  }
})

const Form = compose(
  withSearchRouter,
  withAggregations,
  withT
)(
  ({
    startState,
    urlQuery,
    pushParams,
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
      startState && focusRef && focusRef.input && focusRef.input.focus()
    }, [startState, focusRef])

    useEffect(() => {
      setSearchQuery(slowFormValue)
    }, [slowFormValue])

    const submit = e => {
      e.preventDefault()
      pushParams({ q: formValue, sort: urlQuery ? undefined : DEFAULT_SORT })
    }

    const update = (_, value) => {
      setFormValue(value)
    }

    const reset = () => {
      setFormValue(undefined)
      resetUrl()
    }

    return (
      <div {...styles}>
        <form onSubmit={submit}>
          <Field
            ref={setFocusRef}
            label={t('search/input/label')}
            value={formValue}
            onChange={update}
            icon={
              !startState && (
                <Close
                  style={{ cursor: 'pointer' }}
                  size={30}
                  onClick={reset}
                />
              )
            }
          />
        </form>
        {formValue && urlQuery !== formValue && (
          <LiveState
            formValue={formValue}
            searchQuery={searchQuery}
            dataAggregations={dataAggregations}
          />
        )}
      </div>
    )
  }
)

const FormWrapper = () => {
  const [searchQuery, setSearchQuery] = useState()

  return <Form searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
}

export default FormWrapper
