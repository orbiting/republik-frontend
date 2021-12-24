import React, { useContext, useMemo } from 'react'
import { DiscussionContext, StatementList } from '@project-r/styleguide'
import { useMe } from '../../lib/context/MeContext'
import Loader from '../Loader'
import StatementComposer from './StatementComposer'
import withT from '../../lib/withT'
import TagFilter from '../Discussion/TagFilter'
import OrderByTabs from '../Discussion/OrderByTabs'

const StatementDiscussion = ({ t, tagMappings }) => {
  const {
    discussion,
    loading,
    error,
    refetch,
    actions,
    fetchMore,
    orderBy
  } = useContext(DiscussionContext)
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

  const loadMore = () => {
    if (!discussion) return
    const lastNode =
      discussion.comments.nodes[discussion.comments.nodes.length - 1]
    const endCursor = discussion.comments.pageInfo.endCursor
    fetchMore({
      after: endCursor,
      appendAfter: lastNode.id
    })
  }

  return (
    <Loader
      loading={loading || !discussion}
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
          <div>
            <OrderByTabs
              t={t}
              resolvedOrderBy={discussion.comments.resolvedOrderBy || orderBy}
            />
            <StatementList
              t={t}
              comments={filteredStatements}
              tagMappings={tagMappings}
              actions={{
                handleUpVote: actions.handleUpVote,
                handleDownVote: actions.handleDownVote,
                handleUnVote: actions.handleUnVote
              }}
              disableVoting={!me && !discussion.userCanComment}
              loadMore={loadMore}
              moreAvailableCount={
                discussion.comments.totalCount -
                discussion.comments.nodes.length
              }
            />
          </div>
        </div>
      )}
    />
  )
}

export default withT(StatementDiscussion)
