import React, { useMemo } from 'react'
import { StatementList } from '@project-r/styleguide'
import Loader from '../Loader'
import StatementComposer from './StatementComposer'
import withT from '../../lib/withT'
import TagFilter from '../Discussion/TagFilter'
import { useDiscussion } from '../Discussion/DiscussionProvider/context/DiscussionContext'
import CommentsOptions from '../Discussion/CommentsOptions'
import { useRouter } from 'next/router'
import StatementNodeWrapper from './StatementNodeWrapper'
import DiscussionComposerWrapper from '../Discussion/DiscussionProvider/components/DiscussionComposerWrapper'

const StatementDiscussion = ({ t, tagMappings }) => {
  const {
    discussion,
    loading,
    error,
    refetch,
    actions,
    fetchMore,
    orderBy,
    overlays: { preferencesOverlay }
  } = useDiscussion()
  const router = useRouter()

  const filteredStatements = useMemo(
    () =>
      discussion && discussion.comments
        ? discussion.comments.nodes.filter(
            comment => comment.published && !comment.adminUnpublished
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

  const handleReload = e => {
    e.preventDefault()
    refetch({
      discussionId: discussion.id
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
            {actions.submitCommentHandler && (
              <DiscussionComposerWrapper isTopLevel showPayNotes={false}>
                <StatementComposer
                  t={t}
                  refetch={refetch}
                  onSubmit={(content, tags) =>
                    actions.submitCommentHandler(content, tags, {
                      discussionId: discussion.id
                    })
                  }
                  availableTags={discussion.tags}
                />
              </DiscussionComposerWrapper>
            )}
          </div>
          <div>
            <CommentsOptions
              t={t}
              resolvedOrderBy={discussion.comments.resolvedOrderBy || orderBy}
              handleReload={handleReload}
              discussion={discussion}
              discussionType='statements'
              router={router}
            />
            <StatementList
              t={t}
              comments={filteredStatements}
              tagMappings={tagMappings}
              loadMore={loadMore}
              moreAvailableCount={
                discussion.comments.totalCount -
                discussion.comments.nodes.length
              }
            >
              {filteredStatements.map(comment => (
                <StatementNodeWrapper
                  key={comment.id}
                  comment={comment}
                  tagMappings={tagMappings}
                />
              ))}
            </StatementList>
          </div>
        </div>
      )}
    />
  )
}

export default withT(StatementDiscussion)
