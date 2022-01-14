import React, { useMemo, useState } from 'react'
import { CommentNode } from '@project-r/styleguide'
import { useTranslation } from '../../../lib/withT'
import Link from 'next/link'
import { getFocusHref } from '../CommentLink'
import { format } from 'url'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'
import useVoteCommentHandlers from '../DiscussionProvider/hooks/actions/useVoteCommentHandlers'
import { CommentTreeNode } from '../DiscussionProvider/helpers/makeCommentTree'

type Props = {
  comment: CommentTreeNode
}

const CommentNodeWrapper = ({ comment }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  const { t } = useTranslation()
  const {
    discussion,
    overlays: { shareOverlay }
  } = useDiscussion()

  // Handlers
  const voteHandlers = useVoteCommentHandlers()

  const focusHref = useMemo(() => {
    const urlObject = getFocusHref(discussion, comment)
    return format(urlObject)
  }, [discussion, comment])

  const profileHref = useMemo(
    () =>
      comment?.displayAuthor?.slug
        ? `/~${comment.displayAuthor.slug}`
        : focusHref,
    [comment?.displayAuthor?.slug, focusHref]
  )

  if (isEditing) {
    return <>Hello</>
  }

  return (
    <CommentNode
      t={t}
      comment={comment}
      Link={Link}
      focusHref={focusHref}
      profileHref={profileHref}
      actions={{
        handleUpVote: voteHandlers.upVoteCommentHandler,
        handleDownVote: voteHandlers.downVoteCommentHandler,
        handleUnVote: voteHandlers.unVoteCommentHandler,
        handleReply: () => setIsReplying(true),
        // handleLoadReplies: () => alert('TODO'),
        handleShare: shareOverlay.shareHandler
      }}
      menuItems={[]}
      userCanComment={discussion?.userCanComment}
      userWaitUntil={discussion?.userWaitUntil}
    >
      {isReplying && 'Reply-Composer'}
      {comment.comments.nodes.map(reply => (
        <CommentNodeWrapper key={reply.id} comment={reply} />
      ))}
    </CommentNode>
  )
}

export default CommentNodeWrapper
