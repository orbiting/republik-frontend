import React from 'react'
import { DiscussionFragmentType } from './DiscussionProvider/graphql/fragments/DiscussionFragment.graphql'
import DiscussionProvider from './DiscussionProvider/DiscussionProvider'
import StatementDiscussion from './StatementsDiscussion/StatementDiscussion'
import DialogDiscussion from './Dialog/DialogDiscussion'

type Props = {
  discussionId: string
  meta?: DiscussionFragmentType['meta']
}

const TempDiscussionComponent = ({ discussionId, meta }: Props) => {
  return (
    <DiscussionProvider discussionId={discussionId}>
      {meta && meta?.discussionType === 'statements' ? (
        <StatementDiscussion tagMappings={meta?.tagMappings} />
      ) : (
        <DialogDiscussion />
      )}
    </DiscussionProvider>
  )
}

export default TempDiscussionComponent
