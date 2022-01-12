import React, { useState } from 'react'
import {
  CommentComposer,
  CommentComposerPlaceholder
} from '@project-r/styleguide'
import PropTypes from 'prop-types'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'
import { useTranslation } from '../../../lib/withT'
import { composerHints } from '../constants'
import useDiscussionPreferences from '../DiscussionProvider/hooks/useDiscussionPreferences'
import useSubmitCommentHandler from '../DiscussionProvider/hooks/actions/useSubmitCommentHandler'

const propTypes = {
  onClose: PropTypes.func,
  commentId: PropTypes.string,
  initialText: PropTypes.string,
  initialTagValue: PropTypes.string
}

/**
 * Container component around a CommentComposer to be used inside a statement-discussion.
 */
const StatementComposer = ({
  onClose,
  // Props below are used for editing a comment
  commentId,
  initialText,
  initialTagValue
}) => {
  const { t } = useTranslation()
  const { id, discussion, actions, overlays } = useDiscussion()
  const { preferences } = useDiscussionPreferences(id)
  const submitCommentHandler = useSubmitCommentHandler()

  const { discussionId, displayAuthor, tags, rules } = discussion
  const { editCommentHandler } = actions
  const { preferencesOverlay } = overlays

  const [active, setActive] = useState(!!initialText)

  // Create the submit-handler. In case a commentId was given, handle as edit
  const handleSubmit = async (value, tags) => {
    try {
      let response
      if (!commentId) {
        // A comment on the root-level
        response = await submitCommentHandler(value, tags, {
          discussionId
        })
      } else {
        response = await editCommentHandler(commentId, value, tags)
      }

      setActive(false)

      if (onClose) {
        onClose()
      }

      return response
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
        discussionId={discussion.id}
        commentId={commentId}
        onSubmit={({ text, tags }) => handleSubmit(text, tags)}
        onSubmitLabel={
          !initialText
            ? t('submitComment/rootSubmitLabel')
            : t('styleguide/comment/edit/submit')
        }
        onClose={() => {
          if (onClose) {
            onClose()
          } else {
            setActive(false)
          }
        }}
        onOpenPreferences={() => preferencesOverlay.setOpen(true)}
        onPreviewComment={() => console.debug('NOT IMPLEMENTED YET')}
        hintValidators={composerHints(t)}
        displayAuthor={displayAuthor}
        placeholder={t('components/Discussion/Statement/Placeholder')}
        maxLength={rules?.maxLength}
        tags={tags}
        initialText={initialText}
        initialTagValue={
          tags && tags.length > 0 ? initialTagValue ?? tags[0] : undefined
        }
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

StatementComposer.propTypes = propTypes
