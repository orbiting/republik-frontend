import React from 'react'
import { useRouter } from 'next/router'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import Comments from './Comments'
import TagFilter from './TagFilter'

const DEFAULT_DEPTH = 3

const Discussion = ({
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
  const tag = query.tag

  const depth = board ? 1 : DEFAULT_DEPTH

  return (
    <div data-discussion-id={discussionId}>
      {!rootCommentOverlay && (
        <>
          <TagFilter
            discussionId={discussionId}
            depth={depth}
            orderBy={orderBy}
          />
          <DiscussionCommentComposer
            discussionId={discussionId}
            orderBy={orderBy}
            selectedTag={tag}
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
            `${orderBy}-${
              tag || 'all'
            }` /* To remount of the whole component on change */
          }
          discussionId={discussionId}
          focusId={board ? undefined : focusId}
          depth={depth}
          parentId={parentId}
          orderBy={orderBy}
          tag={tag}
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

export default Discussion
