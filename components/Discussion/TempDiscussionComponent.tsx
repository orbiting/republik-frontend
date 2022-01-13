import React from 'react'
import { DiscussionFragmentType } from './DiscussionProvider/graphql/fragments/DiscussionFragment.graphql'
import DiscussionProvider from './DiscussionProvider/DiscussionProvider'
import AbstractDiscussion from './AbstractDiscussion'

type Props = {
  discussionId: string
  meta?: DiscussionFragmentType['meta']
}

const TempDiscussionComponent = ({ discussionId, meta }: Props) => {
  return (
    <DiscussionProvider discussionId={discussionId}>
      <AbstractDiscussion meta={meta} />
    </DiscussionProvider>
  )
}

export default TempDiscussionComponent
