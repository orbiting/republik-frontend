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
  const ref = useRef()
  useEffect(() => ref.current && ref.current.focus())

  return (
    <form onSubmit={() => canSubmit && onSearchQueryChange(query)}>
      <Field
        inputRef={ref}
        label={t('search/input/label')}
        value={query}
        onChange={(_, value) => setQuery(value)}
        icon={
          query && (
            <Close style={{ cursor: 'pointer' }} size={30} onClick={resetURL} />
          )
        }
      />
    </form>
  )
})

export default Form
