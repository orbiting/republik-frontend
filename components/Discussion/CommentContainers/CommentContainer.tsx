import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import { CommentNode, CommentProps } from '@project-r/styleguide'
import { useTranslation } from '../../../lib/withT'
import Link from 'next/link'
import { getFocusHref } from '../shared/CommentLink'
import { format } from 'url'
import { useDiscussion } from '../context/DiscussionContext'
import useVoteCommentHandlers from '../hooks/actions/useVoteCommentHandlers'
import { CommentTreeNode } from '../helpers/makeCommentTree'
import getCommentMenuItems from './getCommentActions'
import { useMe } from '../../../lib/context/MeContext'
import useReportCommentHandler from '../hooks/actions/useReportCommentHandler'
import useUnpublishCommentHandler from '../hooks/actions/useUnpublishCommentHandler'
import DiscussionComposer from '../DiscussionComposer/DiscussionComposer'

type Props = {
  CommentComponent?: React.ElementType<CommentProps>
  comment: CommentTreeNode
  isLast?: boolean
}

const CommentContainer = ({
  CommentComponent = CommentNode,
  comment,
  isLast
}: Props): ReactElement => {
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  const { t } = useTranslation()
  const { me } = useMe()
  const {
    id: discussionId,
    discussion,
    fetchMore,
    overlays: { shareOverlay, featureOverlay }
  } = useDiscussion()

  // Handlers
  const voteHandlers = useVoteCommentHandlers()
  const reportCommentHandler = useReportCommentHandler()
  const unpublishCommentHandler = useUnpublishCommentHandler()

  const menuItems = useMemo(
    () =>
      getCommentMenuItems({
        t,
        comment,
        setEditMode: setIsEditing,
        roles: me?.roles ?? [],
        actions: {
          reportCommentHandler,
          unpublishCommentHandler,
          featureCommentHandler: featureOverlay.handleOpen
        }
      }),
    [
      t,
      comment,
      setIsEditing,
      me?.roles,
      reportCommentHandler,
      unpublishCommentHandler,
      featureOverlay.handleOpen
    ]
  )

  const parentId = comment.id
  const loadRemainingAfter = discussion?.comments?.pageInfo?.endCursor
  const loadRemainingReplies = useCallback(() => {
    return fetchMore({
      discussionId,
      parentId,
      after: loadRemainingAfter
    })
  }, [discussionId, parentId, loadRemainingAfter, fetchMore])

  return (
    <CommentComponent
      t={t}
      comment={comment}
      Link={Link}
      focusHref={format(getFocusHref(discussion, comment))}
      profileHref={
        comment.displayAuthor.slug
          ? `/~${comment.displayAuthor.slug}`
          : undefined
      }
      actions={{
        handleUpVote: voteHandlers.upVoteCommentHandler,
        handleDownVote: voteHandlers.downVoteCommentHandler,
        handleUnVote: voteHandlers.unVoteCommentHandler,
        handleReply: () => setIsReplying(true),
        handleLoadReplies: loadRemainingReplies,
        handleShare: shareOverlay.shareHandler
      }}
      menuItems={menuItems}
      userCanComment={discussion?.userCanComment}
      userWaitUntil={discussion?.userWaitUntil}
      editComposer={
        comment?.userCanEdit &&
        isEditing && (
          <DiscussionComposer
            onClose={() => setIsEditing(false)}
            commentId={comment.id}
            initialText={comment.text}
            initialTagValue={comment?.tags?.[0]}
          />
        )
      }
      focusId={discussion?.comments?.focus?.id}
      isLast={isLast}
    >
      {discussion?.userCanComment && isReplying && (
        <DiscussionComposer
          onClose={() => setIsReplying(false)}
          parentId={comment.id}
          initialActiveState={true}
        />
      )}
      {comment.comments.nodes.map((reply, index) => (
        <CommentContainer
          key={reply.id}
          comment={reply}
          isLast={index === comment.comments.nodes.length - 1}
        />
      ))}
    </CommentComponent>
  )
}

export default CommentContainer
