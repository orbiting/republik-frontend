import { CommentFragmentType } from './DiscussionProvider/graphql/fragments/CommentFragment.graphql'
import StatementNodeWrapper from './StatementsDiscussion/StatementNodeWrapper'
import React from 'react'
import { FetchDiscussionFunctionType } from './DiscussionProvider/hooks/useDiscussionData'
import EmptyDiscussion from './shared/EmptyDiscussion'

type Props = {
  comments: CommentFragmentType[]
  fetchMore: FetchDiscussionFunctionType
  meta?: any
}

const AbstractDiscussionCommentsRenderer = ({
  comments = [],
  fetchMore,
  meta
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

  return <>Regular Dialog: With {comments.length} comments</>
}

export default AbstractDiscussionCommentsRenderer
