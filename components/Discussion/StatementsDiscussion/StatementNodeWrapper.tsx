import React, { ReactElement, useMemo, useState } from 'react'
import { StatementNode } from '@project-r/styleguide'
import Link from 'next/link'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'
import { useTranslation } from '../../../lib/withT'
import { useMe } from '../../../lib/context/MeContext'
import getStatementActions from './getStatementActions'
import StatementComposer from './StatementComposer'
import { getFocusHref } from '../CommentLink'
import { format } from 'url'
import useVoteCommentHandlers from '../DiscussionProvider/hooks/actions/useVoteCommentHandlers'
import useUnpublishCommentHandler from '../DiscussionProvider/hooks/actions/useUnpublishCommentHandler'
import useReportCommentHandler from '../DiscussionProvider/hooks/actions/useReportCommentHandler'

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
  const { me } = useMe()

  const {
    discussion,
    actions,
    overlays: { preferencesOverlay }
  } = useDiscussion()
  const {
    upVoteCommentHandler,
    downVoteCommentHandler,
    unVoteCommentHandler
  } = useVoteCommentHandlers()
  const unpublishCommentHandler = useUnpublishCommentHandler()
  const reportCommentHandler = useReportCommentHandler()

  const menuItems = useMemo(() => {
    return getStatementActions({
      comment,
      actions: {
        unpublishCommentHandler,
        reportCommentHandler
      },
      roles: me?.roles ?? [],
      t,
      setEditMode
    })
  }, [comment, actions, me?.roles, t])

  const isFocused = useMemo(() => {
    const focusedComment = discussion?.comments?.focus ?? null
    return focusedComment && focusedComment.id === comment.id
  }, [discussion?.comments, comment])

  const focusHref = useMemo(() => {
    const urlObject = getFocusHref(discussion, comment)
    return format(urlObject)
  }, [discussion, comment])

  const profileHref = useMemo(
    () =>
      comment?.displayAuthor?.slug
        ? `~${comment.displayAuthor.slug}`
        : focusHref,
    [comment?.displayAuthor?.slug, focusHref]
  )

  if (editMode) {
    return (
      <StatementComposer
        onClose={() => setEditMode(false)}
        commentId={comment.id}
        initialText={comment.text}
        initialTagValue={comment.tags.length > 0 && comment.tags[0]}
      />
    )
  }

  return (
    <StatementNode
      comment={comment}
      t={t}
      actions={{
        handleUpVote: upVoteCommentHandler,
        handleDownVote: downVoteCommentHandler,
        handleUnVote: unVoteCommentHandler,
        handleShare: actions.shareHandler
      }}
      menuItems={menuItems}
      tagMappings={tagMappings}
      isHighlighted={isFocused}
      disableVoting={!discussion.userCanComment}
      Link={Link}
      focusHref={focusHref}
      profileHref={profileHref}
    />
  )
}

export default StatementNodeWrapper
