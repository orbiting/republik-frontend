import React, { useState } from 'react'
import {
  CommentComposer,
  CommentComposerPlaceholder
} from '@project-r/styleguide'

const StatementComposer = ({ t, refetch, submitHandler, tags }) => {
  const [active, setActive] = useState(false)

  const handleSubmit = async (value, tags) => {
    try {
      await submitHandler(value, tags)
      setActive(false)
      refetch()
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
        onClose={() => setActive(false)}
        onSubmit={({ text, tags }) => handleSubmit(text, tags)}
        onSubmitLabel={t('styleguide/CommentComposer/answer')}
        tagValue={tags && tags.length > 0 ? tags[0] : undefined}
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
