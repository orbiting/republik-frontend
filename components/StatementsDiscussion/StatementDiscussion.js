import React, { useContext, useMemo } from 'react'
import { DiscussionContext } from '@project-r/styleguide'
import PleadingList from './PleadingList'
import { useMe } from '../../lib/context/MeContext'
import Loader from '../Loader'
import StatementComposer from './StatementComposer'
import withT from '../../lib/withT'
import TagFilter from '../Discussion/TagFilter'

const StatementDiscussion = ({ tagMappings, t }) => {
  const { discussion, loading, error, refetch, actions } = useContext(
    DiscussionContext
  )
  const { me } = useMe()

  const filteredStatements = useMemo(
    () =>
      discussion && discussion.comments
        ? discussion.comments.nodes.filter(
            comment => !comment.adminUnpublished && !comment.unpublished
          )
        : [],
    [discussion]
  )

  return (
    <Loader
      loading={loading}
      error={error}
      render={() => (
        <div>
          <div>
            <TagFilter discussion={discussion} />
            {actions.handleSubmit && (
              <StatementComposer
                t={t}
                refetch={refetch}
                submitHandler={actions.handleSubmit}
              />
            )}
          </div>
          <PleadingList
            t={t}
            pleadings={filteredStatements}
            tagMappings={tagMappings}
            actions={{
              handleUpVote: actions.handleUpVote,
              handleDownVote: actions.handleDownVote,
              handleUnVote: actions.handleUnVote
            }}
            disableVoting={!me && !discussion.userCanComment}
          />
        </div>
      )}
    />
  )
}

export default withT(StatementDiscussion)
