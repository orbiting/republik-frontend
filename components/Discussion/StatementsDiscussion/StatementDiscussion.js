import React, { useMemo } from 'react'
import { StatementList } from '@project-r/styleguide'
import Loader from '../../Loader'
import withT, { useTranslation } from '../../../lib/withT'
import TagFilter from '../TagFilter'
import { useDiscussion } from '../DiscussionProvider/context/DiscussionContext'
import CommentsOptions from '../CommentsOptions'
import { useRouter } from 'next/router'
import StatementNodeWrapper from './StatementNodeWrapper'
import DiscussionComposerWrapper from '../DiscussionProvider/components/DiscussionComposerWrapper'
import { getFocusHref } from '../CommentLink'
import DiscussionComposer from '../shared/DiscussionComposer'

const StatementDiscussion = ({ tagMappings }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const {
    discussion,
    loading,
    error,
    refetch,
    fetchMore,
    orderBy,
    focus: { error: focusError }
  } = useDiscussion()

  const filteredStatements = useMemo(
    () => (discussion && discussion.comments ? discussion.comments.nodes : []),
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
    const href = getFocusHref(discussion)
    if (href) {
      router.replace(href).then(() => {
        refetch({
          focusId: undefined
        })
      })
    } else {
      refetch()
    }
  }

  return (
    <Loader
      loading={loading || !discussion}
      error={error}
      render={() => (
        <div>
          <div>
            <DiscussionComposerWrapper isTopLevel showPayNotes>
              <DiscussionComposer
                isRootLevel
                placeholder={t('components/Discussion/Statement/Placeholder')}
              />
            </DiscussionComposerWrapper>
          </div>
          <div>
            <TagFilter discussion={discussion} />
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
              focusError={focusError?.message}
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
