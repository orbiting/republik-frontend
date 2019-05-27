import React, { PureComponent } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { A, colors, fontStyles, mediaQueries } from '@project-r/styleguide'

import { withDiscussionCommentsCount } from './graphql/enhancers/withDiscussionCommentsCount'

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
    marginRight: '20px',
    [mediaQueries.mUp]: {
      marginRight: '40px'
    }
  }),
  selectedOrderBy: css({
    textDecoration: 'underline'
  }),
  emptyDiscussion: css({
    margin: '20px 0'
  })
}

class Discussion extends PureComponent {
  state = {
    /**
     * DiscussionOrder ('DATE' | 'VOTES' | 'REPLIES')
     */
    orderBy: 'DATE',

    /**
     * This is a counter which we increment whenever we want to reset the Apollo
     * cache and reload the comments from the server. The <Comments> component
     * detects if this counter increments and invokes the Apollo refetch() function.
     */
    reload: 0,

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

  onReload = e => {
    e.preventDefault()
    this.setState(({ reload }) => ({ reload: reload + 1 }))
  }

  render () {
    const { t, discussionCommentsCount, discussionId, focusId = null, mute, meta, sharePath } = this.props
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

        {(() => {
          if (discussionCommentsCount > 0) {
            return (
              <>
                <div {...styles.orderByContainer}>
                  <OrderBy value='DATE' />
                  <OrderBy value='VOTES' />
                  <OrderBy value='REPLIES' />
                  <A style={{ float: 'right', lineHeight: '25px', cursor: 'pointer' }} href='' onClick={this.onReload}>
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
                  meta={meta}
                  sharePath={sharePath}
                />
              </>
            )
          } else {
            return <EmptyDiscussion t={t} />
          }
        })()}
      </div>
    )
  }
}

export default compose(
  withT,
  withDiscussionCommentsCount
)(Discussion)

const EmptyDiscussion = ({ t }) => (
  <div {...styles.emptyDiscussion}>{t('components/Discussion/empty')}</div>
)
