import React, { useMemo, useState } from 'react'
import {
  CommentComposer,
  CommentComposerPlaceholder
} from '@project-r/styleguide'
import PropTypes from 'prop-types'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'
import { useTranslation } from '../../../lib/withT'
import { composerHints } from '../constants'
import useSubmitCommentHandler from '../DiscussionProvider/hooks/actions/useSubmitCommentHandler'
import useEditCommentHandler from '../DiscussionProvider/hooks/actions/useEditCommentHandler'
import useDiscussionPreferences from '../DiscussionProvider/hooks/useDiscussionPreferences'

const propTypes = {
  isRootLevel: PropTypes.bool,
  onClose: PropTypes.func,
  commentId: PropTypes.string,
  parentId: PropTypes.string,
  initialText: PropTypes.string,
  initialTagValue: PropTypes.string,
  placeholder: PropTypes.string
}

const DiscussionComposer = ({
  isRootLevel,
  onClose,
  // Props below are used for editing a comment
  commentId,
  parentId,
  initialText,
  initialTagValue,
  placeholder
}) => {
  const { t } = useTranslation()

  const { id: discussionId, discussion, overlays } = useDiscussion()
  const { tags, rules, displayAuthor } = discussion
  const { preferencesOverlay } = overlays

  const {
    preferences,
    updateDiscussionPreferencesHandler
  } = useDiscussionPreferences(discussionId)

  const automaticCredential = useMemo(() => {
    if (!preferences || preferences?.discussion?.userPreference?.anonymity) {
      return null
    }
    return preferences.me.credentials.find(credential => credential.isListed)
  }, [preferences])

  console.debug({
    discussion,
    preferences,
    automaticCredential
  })

  const submitCommentHandler = useSubmitCommentHandler()
  const editCommentHandler = useEditCommentHandler()

  const [active, setActive] = useState(!!initialText)

  // Create the submit-handler. In case a commentId was given, handle as edit
  const handleSubmit = async (value, tags) => {
    try {
      if (automaticCredential) {
        await updateDiscussionPreferencesHandler(
          false,
          automaticCredential.description
        )
      }

      let response

      if (!commentId && !parentId) {
        // New comment on root-level
        response = await submitCommentHandler(value, tags, {
          parentId: undefined,
          discussionId
        })
      } else if (parentId) {
        // Reply to a comment
        response = await submitCommentHandler(value, tags, {
          parentId,
          discussionId: undefined
        })
      } else {
        // Edit a comment
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
        isRoot={isRootLevel}
        discussionId={discussion.id}
        parentId={parentId}
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
        onOpenPreferences={() =>
          preferencesOverlay.handleOpen(automaticCredential)
        }
        onPreviewComment={() => console.debug('NOT IMPLEMENTED YET')}
        hintValidators={composerHints(t)}
        displayAuthor={displayAuthor}
        placeholder={placeholder}
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
      placeholder={placeholder}
    />
  )
}

export default DiscussionComposer

DiscussionComposer.propTypes = propTypes
