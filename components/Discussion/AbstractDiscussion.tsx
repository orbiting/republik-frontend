import React from 'react'
import { useRouter } from 'next/router'
import { Loader, DiscussionCommentsWrapper } from '@project-r/styleguide'
import { useTranslation } from '../../lib/withT'
import { useDiscussion } from './DiscussionProvider/context/DiscussionContext'
import { getFocusHref } from './CommentLink'
import DiscussionComposerWrapper from './DiscussionProvider/components/DiscussionComposerWrapper'
import DiscussionComposer from './shared/DiscussionComposer'
import TagFilter from './TagFilter'
import CommentsOptions from './CommentsOptions'
import AbstractDiscussionCommentsRenderer from './AbstractDiscussionCommentsRenderer'
import DiscussionOptions from './shared/DiscussionOptions'

type Props = {
  meta: any
}

const AbstractDiscussion = ({ meta }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()

  const {
    discussion,
    loading,
    error,
    fetchMore,
    orderBy,
    focus: { error: focusError }
  } = useDiscussion()

  const loadMore = async (): Promise<unknown> => {
    if (!discussion) return
    const lastNode =
      discussion.comments.nodes[discussion.comments.nodes.length - 1]
    const endCursor = discussion.comments.pageInfo.endCursor
    await fetchMore({
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
            <DiscussionComposerWrapper isTopLevel showPayNotes>
              <DiscussionComposer
                isRootLevel
                placeholder={t('components/Discussion/Statement/Placeholder')}
              />
            </DiscussionComposerWrapper>
          </div>
          <div>
            <DiscussionOptions meta={meta} />
            <DiscussionCommentsWrapper
              t={t}
              loadMore={loadMore}
              moreAvailableCount={
                discussion.comments.totalCount -
                discussion.comments.nodes.length
              }
              tagMappings={meta?.tagMapping}
            >
              <AbstractDiscussionCommentsRenderer
                comments={discussion.comments.nodes}
                fetchMore={fetchMore}
                meta={meta}
              />
            </DiscussionCommentsWrapper>
          </div>
        </div>
      )}
    />
  )
}

export default AbstractDiscussion
