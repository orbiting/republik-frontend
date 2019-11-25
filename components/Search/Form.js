import React, { useState, useRef, useEffect } from 'react'
import withT from '../../lib/withT'

import Close from 'react-icons/lib/md/close'

import { Field } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import withSearchRouter from './withSearchRouter'

const Form = compose(
  withSearchRouter,
  withT
)(({ searchQuery, onSearchQueryChange, resetURL, t }) => {
  const [query, setQuery] = useState(searchQuery)
  const canSubmit = query && query !== searchQuery
  const submitQuery = e => {
    e.preventDefault()
    canSubmit && onSearchQueryChange(query)
  }

  const [focusRef, setFocusRef] = useState(null)
  useEffect(() => {
    focusRef && focusRef.input && focusRef.input.focus()
    return
  }, [focusRef])
  // TODO: why no focus on mobile? (@Thomas)

  const reset = () => {
    setQuery(undefined)
    resetURL()
  }

  return (
    <form onSubmit={e => submitQuery(e)}>
      <Field
        ref={setFocusRef}
        label={t('search/input/label')}
        value={query}
        onChange={(_, value) => setQuery(value)}
        icon={
          query && (
            <Close style={{ cursor: 'pointer' }} size={30} onClick={reset} />
          )
        }
      />
    </form>
  )
})

export default Form
