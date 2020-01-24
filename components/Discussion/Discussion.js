import React from 'react'
import { compose } from 'react-apollo'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import NotificationOptions from './NotificationOptions'
import Comments from './Comments'
import withT from '../../lib/withT'
import CommentLink from './CommentLink'

import { CommentTeaser } from '@project-r/styleguide'

const DEFAULT_DEPTH = 3

const Discussion = ({
  discussionId,
  focusId = null,
  mute,
  meta,
  sharePath,
  board,
  parent,
  parentId = null,
  parentComment,
  discussion,
  rootCommentOverlay,
  t
}) => {
  /*
   * DiscussionOrder ('DATE' | 'VOTES' | 'REPLIES')
   */
  const [orderBy, setOrderBy] = React.useState('DATE')

  /*
   * This component manages the 'current time'. It is incremented in descrete intervals
   * and the time is passed down to all child components.
   */
  const [now, setNow] = React.useState(Date.now())
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now())
    }, 30 * 1000)
    return () => clearInterval(intervalId)
  }, [setNow])

  const depth = board ? 1 : DEFAULT_DEPTH
  console.log({ rootCommentOverlay, parentComment, parentId, discussion })

  return (
    <div data-discussion-id={discussionId}>
      {rootCommentOverlay && parentComment && (
        <CommentTeaser
          key={parentComment.id}
          id={parentComment.id}
          t={t}
          displayAuthor={parentComment.displayAuthor}
          preview={{ string: parentComment.text }}
          createdAt={parentComment.createdAt}
          updatedAt={parentComment.updatedAt}
          tags={parentComment.tags}
          parentIds={parentComment.parentIds}
          discussion={discussion}
          Link={CommentLink}
        />
      )}

      <DiscussionCommentComposer
        discussionId={discussionId}
        orderBy={orderBy}
        focusId={focusId}
        depth={depth}
        parentId={parentId}
        parent={parentComment}
        now={now}
      />

      {!rootCommentOverlay && (
        <NotificationOptions discussionId={discussionId} mute={mute} />
      )}

      <div style={{ margin: '20px 0' }}>
        <Comments
          key={orderBy /* To remount of the whole component on change */}
          discussionId={discussionId}
          focusId={focusId}
          depth={depth}
          parentId={parentId}
          orderBy={orderBy}
          now={now}
          meta={meta}
          setOrderBy={setOrderBy}
          board={board}
          parent={parent}
        />
      </div>
    </div>
  )
}

export default compose(withT)(Discussion)
