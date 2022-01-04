import React, { useState } from 'react'
import {
  CommentComposer,
  CommentComposerPlaceholder
} from '@project-r/styleguide'
import PropTypes from 'prop-types'

const StatementComposer = ({
  t,
  onSubmit,
  availableTags,
  refetch,
  // Props below are used for editing a comment
  initialText,
  tagValue,
  onClose,
  displayAuthor
}) => {
  const [active, setActive] = useState(!!initialText)

  const handleSubmit = async (value, tags) => {
    try {
      await onSubmit(value, tags)
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
        onClose={() => {
          if (onClose) {
            onClose()
          } else {
            setActive(false)
          }
        }}
        onSubmit={({ text, tags }) => handleSubmit(text, tags)}
        onSubmitLabel={
          !initialText
            ? t('submitComment/rootSubmitLabel')
            : t('styleguide/comment/edit/submit')
        }
        initialText={initialText}
        tagValue={
          availableTags && availableTags.length > 0
            ? tagValue ?? availableTags[0]
            : undefined
        }
        placeholder={t('components/Discussion/Statement/Placeholder')}
      />
    )
  }
  return (
    <CommentComposerPlaceholder
      t={t}
      displayAuthor={displayAuthor ?? {}}
      onClick={() => setActive(true)}
      onSubmitLabel={t('styleguide/CommentComposer/answer')}
      placeholder={t('components/Discussion/Statement/Placeholder')}
    />
  )
}

export default StatementComposer

StatementComposer.propTypes = {
  t: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.string),
  refetch: PropTypes.func,
  initialText: PropTypes.string,
  tagValue: PropTypes.string,
  onClose: PropTypes.func,
  displayAuthor: PropTypes.object
}
