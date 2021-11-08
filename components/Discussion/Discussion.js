import React from 'react'
import { useRouter } from 'next/router'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import Comments from './Comments'
import TagFilter from './TagFilter'
import { withDiscussionComments } from './graphql/enhancers/withDiscussionComments'
import Loader from '../Loader'

const DEFAULT_DEPTH = 3

const Discussion = ({
  discussionComments,
  discussionId,
  focusId,
  meta,
  board,
  parent,
  parentId,
  includeParent,
  rootCommentOverlay,
  showPayNotes,
  orderBy,
  activeTag,
  depth
}) => {
  return (
    <div data-discussion-id={discussionId}>
      {!rootCommentOverlay && (
        <>
          <TagFilter discussion={discussionComments.discussion} />
          <DiscussionCommentComposer
            discussionComments={discussionComments}
            discussionId={discussionId}
            orderBy={orderBy}
            activeTag={activeTag}
            focusId={focusId}
            depth={depth}
            parentId={parentId}
            showPayNotes={showPayNotes}
          />
        </>
      )}

      <div style={{ margin: rootCommentOverlay ? 0 : '20px 0' }}>
        <Comments
          key={
            `${orderBy}-${activeTag ||
              'all'}` /* To remount of the whole component on change */
          }
          discussionComments={discussionComments}
          discussionId={discussionId}
          focusId={board ? undefined : focusId}
          depth={depth}
          parentId={parentId}
          orderBy={orderBy}
          activeTag={activeTag}
          meta={meta}
          board={board}
          parent={board ? parent || focusId : undefined}
          includeParent={includeParent}
          rootCommentOverlay={rootCommentOverlay}
        />
      </div>
    </div>
  )
}

const DiscussionLoader = withDiscussionComments(
  ({
    discussionComments,
    discussionId,
    focusId = null,
    meta,
    board,
    parent,
    parentId = null,
    includeParent,
    rootCommentOverlay,
    showPayNotes,
    orderBy,
    activeTag,
    depth
  }) => (
    <Loader
      loading={discussionComments.loading}
      error={discussionComments.error}
      render={() => {
        if (!discussionComments.discussion) return null
        return (
          <Discussion
            discussionComments={discussionComments}
            discussionId={discussionId}
            focusId={focusId}
            meta={meta}
            board={board}
            parent={parent}
            parentId={parentId}
            includeParent={includeParent}
            rootCommentOverlay={rootCommentOverlay}
            showPayNotes={showPayNotes}
            orderBy={orderBy}
            activeTag={activeTag}
            depth={depth}
          />
        )
      }}
    />
  )
)

const DiscussionWrapper = ({
  discussionId,
  focusId = null,
  meta,
  board,
  parent,
  parentId = null,
  includeParent,
  rootCommentOverlay,
  showPayNotes
}) => {
  /*
   * DiscussionOrder ('HOT' | 'DATE' | 'VOTES' | 'REPLIES')
   * If 'AUTO' DiscussionOrder is returned by backend via resolvedOrderBy
   */
  const router = useRouter()
  const { query } = router
  const orderBy =
    query.order ||
    (board
      ? 'HOT'
      : discussionId === GENERAL_FEEDBACK_DISCUSSION_ID
      ? 'DATE'
      : 'AUTO')
  const activeTag = query.tag

  const depth = board ? 1 : DEFAULT_DEPTH

  return (
    <DiscussionLoader
      discussionId={discussionId}
      focusId={focusId}
      meta={meta}
      board={board}
      parent={parent}
      parentId={parentId}
      includeParent={includeParent}
      rootCommentOverlay={rootCommentOverlay}
      showPayNotes={showPayNotes}
      orderBy={orderBy}
      activeTag={activeTag}
      depth={depth}
    />
  )
}

export default DiscussionWrapper
