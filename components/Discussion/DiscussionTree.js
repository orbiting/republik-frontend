import React, {PureComponent} from 'react'
import {compose} from 'redux'
import {CommentTreeLoadMore, CommentTreeNode} from '@project-r/styleguide'
import withT from '../../lib/withT'
import {withData, downvoteComment, upvoteComment, submitComment} from './enhancers'

class DiscussionTree extends PureComponent {
  constructor (props) {
    super(props)

    this.fetchMore = () => {
      const {data: {discussion}, fetchMore} = this.props
      if (discussion) {
        fetchMore(null, discussion.comments.pageInfo.endCursor)
      }
    }
  }

  componentDidMount () {
    this.unsubscribe = this.props.subscribeToMore()
  }
  componentWillUnmount () {
    this.unsubscribe()
  }

  render () {
    const {t, data: {loading, error, me, discussion}} = this.props

    if (loading || error) {
      return null
    } else {
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

      const now = Date.now()
      const timeago = (createdAtString) => {
        const createdAt = Date.parse(createdAtString)
        return `${(now - createdAt)}ms`
      }

      return [
        ...discussion.comments.nodes.map((c, i) => (
          <CommentTreeNode
            key={i}
            top
            t={t}
            displayAuthor={displayAuthor}
            comment={c}
            timeago={timeago}
            upvoteComment={this.props.upvoteComment}
            downvoteComment={this.props.downvoteComment}
            submitComment={this.props.submitComment}
            fetchMore={this.props.fetchMore}
          />
        )),
        tail
      ]
    }
  }
}

export default compose(
  withT,
  withData,
  upvoteComment,
  downvoteComment,
  submitComment
)(DiscussionTree)
