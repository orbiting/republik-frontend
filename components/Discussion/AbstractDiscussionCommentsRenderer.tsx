import React from 'react'
import { FetchDiscussionFunctionType } from './DiscussionProvider/hooks/useDiscussionData'
import EmptyDiscussion from './shared/EmptyDiscussion'
import StatementNodeWrapper from './StatementNodeWrapper/StatementNodeWrapper'
import CommentNodeWrapper from './CommentNodeWrapper/CommentNodeWrapper'
import { CommentTreeNode } from './DiscussionProvider/helpers/makeCommentTree'

type Props = {
  comments: CommentTreeNode[]
  fetchMore: FetchDiscussionFunctionType
  meta?: any
  isBoard?: boolean
}

const AbstractDiscussionCommentsRenderer = ({
  comments = [],
  fetchMore,
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
          <StatementNodeWrapper
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
      {comments.map(comment => (
        <CommentNodeWrapper key={comment.id} comment={comment} />
      ))}
    </>
  )
}

export default AbstractDiscussionCommentsRenderer
