import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import Comments from './Comments'

import { discussionPublishedAtQuery } from './graphql/documents'

const DEFAULT_DEPTH = 3

const Discussion = ({
  discussionId,
  focusId = null,
  meta,
  data: { discussion },
  board,
  parent,
  parentId = null,
  includeParent,
  rootCommentOverlay,
  showPayNotes
}) => {
  /*
   * DiscussionOrder ('HOT' | 'DATE' | 'VOTES' | 'REPLIES')
   * Set default order to ('DATE') in the first 24h of dialog
   */
  const router = useRouter()
  const { query } = router

  const publishedAt = new Date(discussion?.document?.meta?.publishDate)
  const twentyFourHoursAgo = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  )
  const [orderBy, setOrderBy] = useState(
    query.order || publishedAt > twentyFourHoursAgo ? 'DATE' : 'VOTES'
  )
  useEffect(() => {
    if (query.order) {
      setOrderBy(query.order)
    }
  }, [query.order])

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

export default compose(
  graphql(discussionPublishedAtQuery, {
    options: ({ discussionId }) => ({
      variables: {
        discussionId: discussionId
      }
    })
  })
)(Discussion)
