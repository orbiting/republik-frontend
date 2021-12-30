import React, { ReactElement, useMemo, useState } from 'react'
import { StatementNode } from '@project-r/styleguide'
import { useDiscussion } from '../Discussion/DiscussionProvider/context/DiscussionContext'
import { useTranslation } from '../../lib/withT'
import { useMe } from '../../lib/context/MeContext'
import getStatementActions from './getStatementActions'
import StatementComposer from './StatementComposer'

type Props = {
  comment: any
  tagMappings: any
}

const StatementNodeWrapper = ({
  comment,
  tagMappings
}: Props): ReactElement => {
  const [editMode, setEditMode] = useState(false)

  const { t } = useTranslation()
  const {
    discussion,
    actions,
    overlays: { preferencesOverlay }
  } = useDiscussion()
  const { me } = useMe()

  const menuItems = useMemo(() => {
    return getStatementActions({
      comment,
      actions,
      roles: me?.roles ?? [],
      t,
      setEditMode
    })
  }, [comment, actions, me?.roles, t])

  const isFocused = useMemo(() => {
    const focusedComment = discussion?.comments?.focus ?? null
    return focusedComment && focusedComment.id === comment.id
  }, [discussion?.comments, comment])

  if (editMode) {
    return (
      <StatementComposer
        t={t}
        availableTags={discussion.tags}
        initialText={comment.text}
        tagValue={comment.tags.length > 0 && comment.tags[0]}
        onSubmit={(content, tags) => {
          return actions
            .editCommentHandler(comment.id, content, tags)
            .then(() => setEditMode(false))
        }}
        onOpenPreferences={preferencesOverlay.handleOpen}
        onClose={() => setEditMode(false)}
        refetch={undefined}
      />
    )
  }

  return (
    <StatementNode
      comment={comment}
      t={t}
      actions={{
        handleUpVote: actions.upVoteCommentHandler,
        handleDownVote: actions.downVoteCommentHandler,
        handleUnVote: actions.unVoteCommentHandler,
        handleShare: actions.shareHandler
      }}
      menuItems={menuItems}
      tagMappings={tagMappings}
      isHighlighted={isFocused}
      disableVoting={discussion.userCanComment}
    />
  )
}

export default StatementNodeWrapper
