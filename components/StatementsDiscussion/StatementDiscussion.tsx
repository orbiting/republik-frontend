import React, { ReactElement, useContext, useMemo } from 'react'
import { DiscussionContext } from '@project-r/styleguide'
import PleadingList from './PleadingList'

type Props = {
  tagMappings: any
}

const StatementDiscussion = ({ tagMappings }: Props): ReactElement => {
  const { discussion, loading, error, actions } = useContext(DiscussionContext)

  const filteredStatements = useMemo(
    () =>
      discussion && discussion.comments
        ? discussion.comments.nodes.filter(
            comment => !comment.adminUnpublished && !comment.unpublished
          )
        : [],
    [discussion]
  )

  if (loading || error) {
    return <p>Loading</p>
  }

  console.debug('Actions', actions)

  return (
    <PleadingList
      pleadings={filteredStatements}
      tagMappings={tagMappings}
      actions={{
        handleUpVote: actions.handleUpVote,
        handleDownVote: actions.handleDownVote,
        handleUnVote: actions.handleUnVote
      }}
    />
  )
}

export default StatementDiscussion
