import React, {PureComponent} from 'react'
import {css} from 'glamor'
import withT from '../../lib/withT'
import {colors, fontStyles} from '@project-r/styleguide'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import DiscussionTree from './DiscussionTree'

const styles = {
  orderByContainer: css({
    margin: '20px 0'
  }),
  orderBy: css({
    ...fontStyles.sansSerifRegular16,
    color: colors.text,
    '-webkit-appearance': 'none',
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
      orderBy: 'DATE' // DiscussionOrder
    }

    this.orderBy = (orderBy) => () => {
      this.setState({orderBy})
    }
  }

  render () {
    const {t, discussionId} = this.props
    const {orderBy} = this.state

    const OrderBy = ({value}) => (
      <button {...styles.orderBy} {...(orderBy === value ? styles.selectedOrderBy : {})} onClick={this.orderBy(value)}>
        {t(`components/Discussion/OrderBy/${value}`)}
      </button>
    )

    return (
      <div>
        <DiscussionCommentComposer
          discussionId={discussionId}
          orderBy={orderBy}
        />

        <div {...styles.orderByContainer}>
          <OrderBy value='DATE' />
          <OrderBy value='VOTES' />
          <OrderBy value='HOT' />
        </div>

        <DiscussionTree
          discussionId={discussionId}
          orderBy={orderBy}
        />
      </div>
    )
  }
}

export default withT(Discussion)
