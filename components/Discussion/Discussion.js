import React from 'react'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import NotificationOptions from './NotificationOptions'
import Comments from './Comments'

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
  includeParent,
  rootCommentOverlay
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
            now={now}
          />
          <NotificationOptions discussionId={discussionId} mute={mute} />
        </>
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
          includeParent={includeParent}
        />
      </div>
    </div>
  )
}

export default Discussion
