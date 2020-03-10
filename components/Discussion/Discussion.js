import React from 'react'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import Comments from './Comments'
import { Interaction, colors } from '@project-r/styleguide'
import withT from '../../lib/withT'
import { css } from 'glamor'
import SubscribeDebateMenu from '../Notifications/SubscribeDebateMenu'

const DEFAULT_DEPTH = 3

const styles = {
  title: css({
    borderBottom: `1px solid ${colors.text}`,
    paddingBottom: '2.2rem',
    marginBottom: 20,
    alignItems: 'center',
    display: 'flex'
  })
}

const Discussion = ({
  discussionId,
  commentCount,
  focusId = null,
  mute,
  meta,
  sharePath,
  board,
  parent,
  parentId = null,
  includeParent,
  rootCommentOverlay,
  t
}) => {
  /*
   * DiscussionOrder ('HOT' | 'DATE' | 'VOTES' | 'REPLIES')
   */
  const [orderBy, setOrderBy] = React.useState(board ? 'HOT' : 'DATE')

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
          <div {...styles.title}>
            <Interaction.H2>
              {t.pluralize('feed/title', {
                count: commentCount || 0
              })}
            </Interaction.H2>
            <SubscribeDebateMenu discussionId={discussionId} />
          </div>
          <DiscussionCommentComposer
            discussionId={discussionId}
            orderBy={orderBy}
            focusId={focusId}
            depth={depth}
            parentId={parentId}
            now={now}
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
          now={now}
          meta={meta}
          setOrderBy={setOrderBy}
          board={board}
          parent={board ? parent || focusId : undefined}
          includeParent={includeParent}
          rootCommentOverlay={rootCommentOverlay}
        />
      </div>
    </div>
  )
}

export default withT(Discussion)
