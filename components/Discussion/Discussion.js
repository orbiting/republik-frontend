import React from 'react'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import NotificationOptions from './NotificationOptions'
import Comments from './Comments'

const Discussion = ({ discussionId, focusId = null, mute, meta, sharePath }) => {
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

  return (
    <div data-discussion-id={discussionId}>
      <DiscussionCommentComposer
        discussionId={discussionId}
        orderBy={orderBy}
        focusId={focusId}
        depth={1}
        parentId={null}
        now={now}
      />

      <NotificationOptions discussionId={discussionId} mute={mute} />

      <Comments
        depth={3}
        key={orderBy}
        discussionId={discussionId}
        focusId={focusId}
        parentId={null}
        orderBy={orderBy}
        now={now}
        meta={meta}
        sharePath={sharePath}
        setOrderBy={setOrderBy}
      />
    </div>
  )
}

export default Discussion
