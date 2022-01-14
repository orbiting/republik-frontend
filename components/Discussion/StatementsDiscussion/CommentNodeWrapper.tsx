import React, { useMemo, useState } from 'react'
import { CommentNode } from '@project-r/styleguide'
import { CommentFragmentType } from '../DiscussionProvider/graphql/fragments/CommentFragment.graphql'
import { useTranslation } from '../../../lib/withT'
import Link from 'next/link'
import { getFocusHref } from '../CommentLink'
import { format } from 'url'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'
import useVoteCommentHandlers from '../DiscussionProvider/hooks/actions/useVoteCommentHandlers'

type Props = {
  comment: CommentFragmentType
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

  if (isEditing) {
    return 'Edit-Composer'
  }

  return (
    <CommentNode
      t={t}
      comment={comment}
      Link={Link}
      focusHref={focusHref}
      actions={{
        handleUpVote: voteHandlers.upVoteCommentHandler,
        handleDownVote: voteHandlers.downVoteCommentHandler,
        handleUnVote: voteHandlers.unVoteCommentHandler,
        handleReply: () => setIsReplying(true),
        handleLoadReplies: () => alert('TODO'),
        handleShare: () => shareOverlay.shareHandler(comment)
      }}
      menuItems={[]}
      userCanComment={discussion?.userCanComment}
      userWaitUntil={discussion?.userWaitUntil}
    >
      {isReplying && 'Reply-Composer'}
    </CommentNode>
  )
}

export default CommentNodeWrapper
