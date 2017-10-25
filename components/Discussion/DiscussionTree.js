import React, {PureComponent} from 'react'
import {compose} from 'redux'
import {CommentTreeLoadMore, CommentTreeNode} from '@project-r/styleguide'
import Loader from '../Loader'
import withT from '../../lib/withT'
import timeago from '../../lib/timeago'
import {withData, downvoteComment, upvoteComment, submitComment} from './enhancers'

class DiscussionTree extends PureComponent {
  constructor (props) {
    super(props)

    this.state = { now: Date.now() }
    this.fetchMore = () => {
      const {data: {discussion}, fetchMore} = this.props
      if (discussion) {
        fetchMore(null, discussion.comments.pageInfo.endCursor)
      }
    }
  }

  componentDidMount () {
    this.unsubscribe = this.props.subscribeToMore()
    this.intervalId = setInterval(() => {
      this.setState({ now: Date.now() })
    }, 30 * 1000)
  }
  componentWillUnmount () {
    this.unsubscribe()
    clearInterval(this.intervalId)
  }

  render () {
    const {t, data: {loading, error, me, discussion}} = this.props
    const {now} = this.state

    return (
      <Loader
        loading={loading}
        error={error}
        message={'Loading…'}
        render={() => {
          const displayAuthor = {
            publicPicture: me.publicUser && me.publicUser.testimonial && me.publicUser.testimonial.image,
            name: me.name,
            credential: discussion.userPreference && discussion.userPreference.credential
          }

          const {totalCount, pageInfo, nodes} = discussion.comments
          const tail = (() => {
            if (pageInfo && pageInfo.hasNextPage) {
              return (
                <CommentTreeLoadMore
                  key='loadMore'
                  t={t}
                  count={totalCount - (nodes ? nodes.length : 0)}
                  onClick={this.fetchMore}
                />
              )
            } else {
              return null
            }
          })()

          const timeagoFromNow = (createdAtString) => {
            return timeago(t, (now - Date.parse(createdAtString)) / 1000)
          }

          return [
            ...discussion.comments.nodes.map((comment, index) => (
              <CommentTreeNode
                key={index}
                top
                t={t}
                displayAuthor={displayAuthor}
                comment={comment}
                timeago={timeagoFromNow}
                upvoteComment={this.props.upvoteComment}
                downvoteComment={this.props.downvoteComment}
                submitComment={this.props.submitComment}
                fetchMore={this.props.fetchMore}
              />
            )),
            tail
          ]
        }}
      />
    )
  }
}

export default compose(
  withT,
  withData,
  upvoteComment,
  downvoteComment,
  submitComment
)(DiscussionTree)
