import React from 'react'
import DiscussionProvider from './DiscussionProvider/DiscussionProvider'
import Discussion from './Discussion'

type Props = {
  discussionId: string
  meta?: any // TODO
}

const TempDiscussionComponent = ({ discussionId, meta }: Props) => {
  return (
    <DiscussionProvider discussionId={discussionId}>
      <Discussion meta={meta} />
    </DiscussionProvider>
  )
}

export default TempDiscussionComponent
