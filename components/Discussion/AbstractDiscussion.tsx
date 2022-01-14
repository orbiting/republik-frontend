import React, { useMemo } from 'react'
import {
  Loader,
  DiscussionCommentsWrapper,
  pxToRem
} from '@project-r/styleguide'
import { useTranslation } from '../../lib/withT'
import { useDiscussion } from './DiscussionProvider/context/DiscussionContext'
import DiscussionComposerWrapper from './DiscussionProvider/components/DiscussionComposerWrapper'
import DiscussionComposer from './shared/DiscussionComposer'
import AbstractDiscussionCommentsRenderer from './AbstractDiscussionCommentsRenderer'
import DiscussionOptions from './shared/DiscussionOptions'
import makeCommentTree from './DiscussionProvider/helpers/makeCommentTree'
import { css } from 'glamor'
import useDiscussionFocusHelper from './DiscussionProvider/hooks/useDiscussionFocusHelper'

const styles = {
  commentsWrapper: css({
    marginTop: pxToRem(20)
  })
}

type Props = {
  meta: any
}

const AbstractDiscussion = ({ meta }: Props) => {
  const { t } = useTranslation()

  const {
    discussion,
    loading: discussionLoading,
    error: discussionError,
    fetchMore
  } = useDiscussion()

  const { error: focusError } = useDiscussionFocusHelper()

  const comments = useMemo(() => {
    if (!discussion) {
      return {
        totalCount: 0,
        directTotalCount: 0,
        pageInfo: {},
        nodes: []
      }
    }
    return makeCommentTree(discussion?.comments)
  }, [discussion])

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
      loading={discussionLoading || !discussion}
      error={discussionError}
      render={() => (
        <div>
          <DiscussionComposerWrapper isTopLevel showPayNotes>
            <DiscussionComposer
              isRootLevel
              placeholder={
                meta?.discussionType === 'statements'
                  ? 'components/Discussion/Statement/Placeholder'
                  : undefined
              }
            />
          </DiscussionComposerWrapper>
          <div {...styles.commentsWrapper}>
            <DiscussionOptions meta={meta} />
            <DiscussionCommentsWrapper
              t={t}
              loadMore={loadMore}
              moreAvailableCount={
                comments.directTotalCount - comments.nodes.length
              }
              tagMappings={meta?.tagMappings}
              errorMessage={focusError?.message}
            >
              <AbstractDiscussionCommentsRenderer
                comments={comments.nodes}
                isBoard={discussion?.isBoard}
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
