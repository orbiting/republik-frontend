import React from 'react'
import { useRouter } from 'next/router'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import Comments from './Comments'

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
  const orderBy = query.order || 'AUTO'

  const depth = board ? 1 : DEFAULT_DEPTH

  return (
    <div data-discussion-id={discussionId}>
      {!rootCommentOverlay && (
        <>
          <DiscussionCommentComposer
            discussionId={discussionId}
            orderBy={orderBy}
            focusId={focusId}
            depth={depth}
            parentId={parentId}
            showPayNotes={showPayNotes}
          />
        </>
      )}

      <div style={{ margin: rootCommentOverlay ? 0 : '20px 0' }}>
        <Comments
          key={orderBy /* To remount of the whole component on change */}
          discussionId={discussionId}
          focusId={board ? undefined : focusId}
          depth={depth}
          parentId={parentId}
          orderBy={orderBy}
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
