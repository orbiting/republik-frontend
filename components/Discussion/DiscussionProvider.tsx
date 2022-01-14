import React from 'react'
import DiscussionContextProvider from './context/DiscussionContextProvider'
import Discussion from './Discussion'

type Props = {
  discussionId: string
  meta?: any // TODO
}

const DiscussionProvider = ({ discussionId, meta }: Props) => {
  return (
    <DiscussionContextProvider discussionId={discussionId}>
      <Discussion meta={meta} />
    </DiscussionContextProvider>
  )
}

export default DiscussionProvider
