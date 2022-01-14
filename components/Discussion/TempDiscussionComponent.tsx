import React from 'react'
import DiscussionProvider from './DiscussionProvider/DiscussionProvider'
import AbstractDiscussion from './AbstractDiscussion'

type Props = {
  discussionId: string
  meta?: any // TODO
}

const TempDiscussionComponent = ({ discussionId, meta }: Props) => {
  return (
    <DiscussionProvider discussionId={discussionId}>
      <AbstractDiscussion meta={meta} />
    </DiscussionProvider>
  )
}

export default TempDiscussionComponent
