import React, { useState, useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import {
  Field,
  mediaQueries,
  useDebounce,
  usePrevious
} from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'
import { withAggregations } from './enhancers'
import { DEFAULT_SORT } from './constants'
import LiveState from './LiveState'
import { css } from 'glamor'

import withT from '../../lib/withT'
import { Router } from '../../lib/routes'

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
    pushSearchParams,
    getSearchParams,
    dataAggregations,
    t,
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
    noInitialFocus
  }) => {
    const [focusRef, setFocusRef] = useState(null)
    const [formValue, setFormValue] = useState(urlQuery)
    const [slowFormValue] = useDebounce(formValue, 200)
    useEffect(() => {
      startState &&
        !noInitialFocus &&
        focusRef &&
        focusRef.input &&
        focusRef.input.focus()
    }, [startState, focusRef])

    useEffect(() => {
      setSearchQuery(slowFormValue)
    }, [slowFormValue])

    const previousUrlQuery = usePrevious(urlQuery)

    useEffect(() => {
      if (previousUrlQuery !== urlQuery) {
        setFormValue(urlQuery)
      }
    }, [urlQuery, previousUrlQuery])

    const submit = e => {
      e.preventDefault()
      pushSearchParams({
        q: formValue,
        sort: urlQuery ? undefined : DEFAULT_SORT
      })
      if (onSearchSubmit) {
        onSearchSubmit()
      }
    }

    const update = (_, value) => {
      setFormValue(value)
    }

    const reset = () => {
      setFormValue(undefined)
      Router.pushRoute('search')
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
                <MdClose
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
            getSearchParams={getSearchParams}
            onClickSearchResults={onSearchSubmit}
          />
        )}
      </div>
    )
  }
)

const FormWrapper = ({ onSearchSubmit, noInitialFocus }) => {
  const [searchQuery, setSearchQuery] = useState()

  return (
    <Form
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSearchSubmit={onSearchSubmit}
      noInitialFocus={noInitialFocus}
    />
  )
}

export default FormWrapper
