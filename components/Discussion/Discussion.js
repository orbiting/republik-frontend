import React, { PureComponent } from 'react'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import NotificationOptions from './NotificationOptions'
import Comments from './Comments'

class Discussion extends PureComponent {
  state = {
    /**
     * DiscussionOrder ('DATE' | 'VOTES' | 'REPLIES')
     */
    orderBy: 'DATE',

    now: Date.now()
  }

  componentDidMount () {
    this.intervalId = setInterval(() => {
      this.setState({ now: Date.now() })
    }, 30 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  onOrderBy = orderBy => {
    this.setState({ orderBy })
  }

  render () {
    const { discussionId, focusId = null, mute, meta, sharePath } = this.props
    const { orderBy, reload, now } = this.state

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
          depth={1}
          key={orderBy}
          discussionId={discussionId}
          focusId={focusId}
          parentId={null}
          reload={reload}
          orderBy={orderBy}
          now={now}
          meta={meta}
          sharePath={sharePath}
          onOrderBy={this.onOrderBy}
        />
      </div>
    )
  }
}

export default Discussion
