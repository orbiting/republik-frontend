import React, { PureComponent } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { A, colors, fontStyles } from '@project-r/styleguide'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import NotificationOptions from './NotificationOptions'
import Comments from './Comments'

const styles = {
  orderByContainer: css({
    margin: '20px 0'
  }),
  orderBy: css({
    ...fontStyles.sansSerifRegular16,
    outline: 'none',
    color: colors.text,
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    marginRight: '40px'
  }),
  selectedOrderBy: css({
    textDecoration: 'underline'
  })
}

class Discussion extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      orderBy: 'HOT', // DiscussionOrder
      reload: 0,
      now: Date.now()
    }
  }

  componentDidMount () {
    this.intervalId = setInterval(() => {
      this.setState({ now: Date.now() })
    }, 30 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  render () {
    const {t, discussionId, focusId = null, mute, disableTopLevelComments} = this.props
    const { orderBy, reload, now } = this.state

    const OrderBy = ({ children, value }) => (
      <button {...styles.orderBy} {...(orderBy === value ? styles.selectedOrderBy : {})} onClick={() => {
        this.setState({ orderBy: value })
      }}>
        {t(`components/Discussion/OrderBy/${value}`)}
      </button>
    )

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

        <div {...styles.orderByContainer}>
          <OrderBy value='HOT' />
          <OrderBy value='DATE' />
          <OrderBy value='VOTES' />
          <A style={{ float: 'right', lineHeight: '25px', cursor: 'pointer' }} href='' onClick={(e) => {
            e.preventDefault()
            this.setState(({ reload }) => ({ reload: reload + 1 }))
          }}>
            {t('components/Discussion/reload')}
          </A>
          <br style={{ clear: 'both' }} />
        </div>

        <Comments
          depth={1}
          key={orderBy}
          discussionId={discussionId}
          focusId={focusId}
          parentId={null}
          reload={reload}
          orderBy={orderBy}
          now={now}
        />
      </div>
    )
  }
}

export default withT(Discussion)
