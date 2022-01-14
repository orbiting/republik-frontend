import React from 'react'
import { FetchDiscussionFunctionType } from './hooks/useDiscussionData'
import EmptyDiscussion from './shared/EmptyDiscussion'
import StatementContainer from './CommentContainers/StatementContainer'
import CommentContainer from './CommentContainers/CommentContainer'
import { CommentTreeNode } from './helpers/makeCommentTree'

type Props = {
  comments: CommentTreeNode[]
  meta?: any
  isBoard?: boolean
}

const DiscussionCommentTreeRenderer = ({
  comments = [],
  meta,
  isBoard
}: Props) => {
  if (comments.length === 0) {
    return <EmptyDiscussion />
  }

  if (meta?.discussionType === 'statements') {
    const tagMappings = meta?.tagMappings ?? []

    return (
      <>
        {comments.map(comment => (
          <StatementContainer
            key={comment.id}
            comment={comment}
            tagMappings={tagMappings}
          />
        ))}
      </>
    )
  }

  if (isBoard) {
    return <p>Render board comments</p>
  }

  return (
    <>
      {comments.map((comment, index) => (
        <CommentContainer
          key={comment.id}
          comment={comment}
          isLast={index === comments.length - 1}
        />
      ))}
    </>
  )
}

export default DiscussionCommentTreeRenderer
