import React, { useState } from 'react'
import {
  CommentComposer,
  CommentComposerPlaceholder
} from '@project-r/styleguide'
import PropTypes from 'prop-types'

const StatementComposer = ({
  t,
  submitHandler,
  availableTags,
  refetch,
  // Props below are used for editing a comment
  initialText,
  tagValue,
  onClose
}) => {
  const [active, setActive] = useState(!!initialText)

  const handleSubmit = async (value, tags) => {
    try {
      await submitHandler(value, tags)
      setActive(false)
      if (refetch) {
        refetch()
      }
      return { ok: true }
    } catch (err) {
      return {
        error: err
      }
    }
  }

  if (active) {
    return (
      <CommentComposer
        t={t}
        isRoot
        hideHeader
        onClose={() => {
          if (onClose) {
            onClose()
          } else {
            setActive(false)
          }
        }}
        onSubmit={({ text, tags }) => handleSubmit(text, tags)}
        onSubmitLabel={t('styleguide/CommentComposer/answer')}
        initialText={initialText}
        tagValue={
          availableTags && availableTags.length > 0
            ? tagValue ?? availableTags[0]
            : undefined
        }
      />
    )
  }
  return (
    <CommentComposerPlaceholder
      t={t}
      displayAuthor={{}}
      onClick={() => setActive(true)}
      onSubmitLabel={t('styleguide/CommentComposer/answer')}
    />
  )
}

export default StatementComposer

StatementComposer.propTypes = {
  t: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.string),
  refetch: PropTypes.func,
  initialText: PropTypes.string,
  tagValue: PropTypes.string,
  onClose: PropTypes.func
}
