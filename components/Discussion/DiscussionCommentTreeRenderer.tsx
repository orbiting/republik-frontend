import React from 'react'
import EmptyDiscussion from './shared/EmptyDiscussion'
import StatementContainer from './CommentContainers/StatementContainer'
import CommentContainer from './CommentContainers/CommentContainer'
import { CommentTreeNode } from './helpers/makeCommentTree'
import { BoardComment } from '@project-r/styleguide'

type Props = {
  comments: CommentTreeNode[]
  documentMeta?: any
  isBoard?: boolean
}

const DiscussionCommentTreeRenderer = ({
  comments = [],
  documentMeta,
  isBoard
}: Props) => {
  if (comments.length === 0) {
    return <EmptyDiscussion />
  }

  if (documentMeta?.discussionType === 'statements') {
    const tagMappings = documentMeta?.tagMappings ?? []

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
    return (
      <>
        {comments.map(comment => (
          <CommentContainer
            key={comment.id}
            CommentComponent={BoardComment}
            comment={comment}
          />
        ))}
      </>
    )
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
