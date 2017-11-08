import React, {PureComponent} from 'react'
import {compose} from 'redux'
import {colors, CommentTreeLoadMore, CommentTreeCollapse, CommentTreeNode} from '@project-r/styleguide'
import Loader from '../Loader'
import withT from '../../lib/withT'
import timeago from '../../lib/timeago'
import {maxLogicalDepth, countNodes, withData, downvoteComment, upvoteComment, submitComment} from './enhancers'

class DiscussionTreePortal extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {isExpanded: false}
    this.toggle = () => {
      this.setState({isExpanded: !this.state.isExpanded})
    }
  }

  render () {
    const {t, count, ...props} = this.props

    if (this.state.isExpanded) {
      return (
        <div>
          <CommentTreeCollapse
            t={t}
            onClick={this.toggle}
          />

          <DiscussionTree
            {...props}
            visualDepth={1}
            top={false}
            head={false}
            tail={false}
            t={t}
          />
          <div
            style={{marginTop: '-2px', borderTop: `2px solid ${colors.primary}`}}
          />
        </div>
      )
    }

    return (
      <CommentTreeLoadMore
        t={t}
        visualDepth={this.props.visualDepth - 1}
        count={count}
        onClick={this.toggle}
      />
    )
  }
}

class DiscussionTreeRenderer extends PureComponent {
  constructor (props) {
    super(props)

    this.state = { now: Date.now() }

    // Fetch more comments at the root level of this 'Discussion' tree.
    this.fetchMore = () => {
      const {data: {discussion}, fetchMore} = this.props
      if (discussion) {
        fetchMore(null, discussion.comments.pageInfo.endCursor)
      }
    }

    // Fetch more replies to the given comment.
    this.fetchMoreReplies = ({id, comments}) => {
      const {fetchMore} = this.props
      if (comments && comments.pageInfo) {
        fetchMore(id, comments.pageInfo.endCursor)
      } else {
        fetchMore(id, undefined)
      }
    }

    const More = ({visualDepth, logicalDepth, comment}) => {
      const {t, discussionId, orderBy} = this.props
      const {comments} = comment

      if (comments && comments.totalCount > 0) {
        const {totalCount, pageInfo} = comments
        const count = totalCount

        if (logicalDepth >= maxLogicalDepth) {
          return (
            <DiscussionTreePortal
              t={t}
              discussionId={discussionId}
              parentId={comment.id}
              orderBy={orderBy}
              count={count}
              visualDepth={visualDepth}
            />
          )
        } else if (pageInfo && pageInfo.hasNextPage) {
          return (
            <CommentTreeLoadMore
              t={t}
              visualDepth={visualDepth}
              count={count}
              onClick={() => this.fetchMoreReplies(comment)}
            />
          )
        } else {
          return null
        }
      } else {
        return null
      }
    }
    this.More = More
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
    const {
      logicalDepth = 0,
      visualDepth = 0,
      top = true,
      t,
      data: {loading, error, me, discussion}
    } = this.props

    const {now} = this.state
    const timeagoFromNow = (createdAtString) => {
      return timeago(t, (now - Date.parse(createdAtString)) / 1000)
    }

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

          // This is the 'CommentTreeLoadMore' element which loads more comments in the discussion root.
          const tail = (() => {
            const {totalCount, pageInfo, nodes} = discussion.comments
            if (pageInfo && pageInfo.hasNextPage) {
              return (
                <CommentTreeLoadMore
                  key='loadMore'
                  t={t}
                  visualDepth={1}
                  count={totalCount - countNodes(nodes)}
                  onClick={this.fetchMore}
                />
              )
            } else {
              return null
            }
          })()

          return [
            ...discussion.comments.nodes.map((comment, index) => (
              <CommentTreeNode
                key={index}
                logicalDepth={logicalDepth}
                visualDepth={visualDepth}
                top={top}
                head={false}
                tail={false}
                t={t}
                displayAuthor={displayAuthor}
                comment={comment}
                timeago={timeagoFromNow}
                upvoteComment={this.props.upvoteComment}
                downvoteComment={this.props.downvoteComment}
                submitComment={this.props.submitComment}
                More={this.More}
              />
            )),
            tail
          ]
        }}
      />
    )
  }
}

const DiscussionTree = compose(
  withT,
  withData,
  upvoteComment,
  downvoteComment,
  submitComment
)(DiscussionTreeRenderer)

export default DiscussionTree
