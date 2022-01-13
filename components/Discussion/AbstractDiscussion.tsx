import { useRouter } from 'next/router'
import { Loader } from '@project-r/styleguide'
import { useTranslation } from '../../lib/withT'
import { useDiscussion } from './DiscussionProvider/context/DiscussionContext'
import React, { useMemo } from 'react'
import { getFocusHref } from './CommentLink'
import DiscussionComposerWrapper from './DiscussionProvider/components/DiscussionComposerWrapper'
import DiscussionComposer from './shared/DiscussionComposer'
import TagFilter from './TagFilter'
import CommentsOptions from './CommentsOptions'
import { CommentFragmentType } from './DiscussionProvider/graphql/fragments/CommentFragment.graphql'
import { DiscussionFragmentType } from './DiscussionProvider/graphql/fragments/DiscussionFragment.graphql'
import AbstractDiscussionCommentsRenderer from './AbstractDiscussionCommentsRenderer'

type Props = {
  meta: DiscussionFragmentType['meta']
}

const AbstractDiscussion = ({ meta }: Props) => {
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
            <>
              <AbstractDiscussionCommentsRenderer
                meta={meta}
                comments={discussion.comments.nodes}
                fetchMore={fetchMore}
              />
              <button onClick={loadMore}>
                Load more : $
                {discussion.comments.totalCount -
                  discussion.comments.nodes.length}{' '}
                more comments available
              </button>
            </>
          </div>
        </div>
      )}
    />
  )
}

export default AbstractDiscussion
