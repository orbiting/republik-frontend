import React, {PureComponent} from 'react'
import { compose, graphql } from 'react-apollo'

import { errorToString } from '../../lib/utils/errors'

import withT from '../../lib/withT'
import timeago from '../../lib/timeago'

import Loader from '../Loader'

import { withDiscussionDisplayAuthor, downvoteComment, upvoteComment, editComment, unpublishComment, isAdmin, query, submitComment } from './enhancers'
import DiscussionPreferences from './DiscussionPreferences'

import {
  colors,
  CommentTreeLoadMore,
  CommentTreeCollapse,
  CommentTreeRow
} from '@project-r/styleguide'

class Comments extends PureComponent {
  constructor (...args) {
    super(...args)

    this.state = {
      now: Date.now(),
      showPreferences: false
    }

    this.showPreferences = () => {
      this.setState({
        showPreferences: true
      })
    }

    this.closePreferences = () => {
      this.setState({
        showPreferences: false
      })
    }
  }
  render () {
    const {
      discussionId,
      discussionDisplayAuthor: displayAuthor,
      t,
      data: {loading, error, discussion},
      fetchMore
    } = this.props

    const {now, showPreferences} = this.state
    const timeagoFromNow = (createdAtString) => {
      return timeago(t, (now - Date.parse(createdAtString)) / 1000)
    }

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          const {totalCount, pageInfo, nodes} = discussion.comments

          // This is the 'CommentTreeLoadMore' element which loads more comments in the discussion root.
          const tail = (() => {
            if (pageInfo && pageInfo.hasNextPage) {
              return (
                <CommentTreeLoadMore
                  key='loadMore'
                  t={t}
                  visualDepth={1}
                  count={totalCount - nodes.length}
                  onClick={() => fetchMore(null, pageInfo.endCursor)}
                />
              )
            }
            return null
          })()

          const discussionPreferences = (() => {
            if (showPreferences) {
              return (
                <DiscussionPreferences
                  key='discussionPreferenes'
                  discussionId={discussionId}
                  onClose={this.closePreferences}
                />
              )
            }
            return null
          })()

          return nodes
            .reduce((accumulator, comment, index, all) => {
              const { counts } = accumulator

              // accumulator.list.push(<div>{comment.id}</div>)
              accumulator.list.push(
                <CommentTreeRow
                  key={comment.id}
                  t={t}
                  visualDepth={comment.parentIds.length + 1}
                  head={false}
                  tail={false}
                  otherChild
                  comment={comment}
                  displayAuthor={displayAuthor}
                  onEditPreferences={this.showPreferences}
                  isAdmin={isAdmin}
                  submitComment={this.props.submitComment}
                  editComment={this.props.editComment}
                  upvoteComment={this.props.upvoteComment}
                  downvoteComment={this.props.downvoteComment}
                  unpublishComment={this.props.unpublishComment}
                  timeago={timeagoFromNow}
                />
              )

              comment.parentIds.forEach(id => {
                counts[id] = (counts[id] || 0) + 1
              })

              const next = all[index + 1]
              const nextIsChild = next && next.parentIds.indexOf(comment.id) !== -1
              if (nextIsChild) {
                accumulator.pendingClosure.push(comment)
              }
              if (!nextIsChild) {
                const count = counts[comment.id] || 0
                if (comment.comments.totalCount > count) {
                  accumulator.list.push(
                    <CommentTreeLoadMore
                      key={`loadMore${comment.id}`}
                      t={t}
                      connected
                      visualDepth={comment.parentIds.length + 1}
                      count={comment.comments.totalCount - count}
                      onClick={() => fetchMore(comment.id, comment.comments.pageInfo.endCursor)}
                    />
                  )
                }

                const needsClosure = accumulator.pendingClosure
                  .filter(pending => comment.parentIds.indexOf(pending.id) === -1)
                needsClosure.forEach(comment => {
                  const count = counts[comment.id] || 0
                  if (comment.comments.directTotalCount > count) {
                    // accumulator.list.push(<div>{comment.id} {count} {comment.comments.directTotalCount}</div>)
                    accumulator.list.push(
                      <CommentTreeLoadMore
                        key={`loadMore${comment.id}`}
                        t={t}
                        visualDepth={comment.parentIds.length + 1}
                        count={comment.comments.totalCount - count}
                        onClick={() => fetchMore(comment.id, comment.comments.pageInfo.endCursor)}
                      />
                    )
                  }
                })
                accumulator.pendingClosure = accumulator.pendingClosure
                  .filter(pending => needsClosure.indexOf(pending) === -1)
              }

              return accumulator
            }, {
              visualDepth: 1,
              list: [],
              pendingClosure: [],
              counts: {}
            })
            .list
            .concat(tail, discussionPreferences)
        }}
      />
    )
  }
}

export default compose(
  withT,
  withDiscussionDisplayAuthor,
  upvoteComment,
  downvoteComment,
  editComment,
  unpublishComment,
  isAdmin,
  submitComment,
  graphql(query, {
    props: ({ownProps: {discussionId, orderBy}, data: {fetchMore, subscribeToMore, ...data}}) => ({
      data,
      fetchMore: (parentId, after) => {
        return fetchMore({
          variables: {discussionId, parentId, after, orderBy},
          updateQuery: (previousResult, {fetchMoreResult: {discussion}}) => {
            let nodes = previousResult.discussion.comments.nodes
            const nodeIndex = nodes.reduce(
              (index, node) => {
                index[node.id] = node
                return index
              },
              {}
            )

            const newNodes = discussion.comments.nodes
              .filter(node => !nodeIndex[node.id])
            if (!parentId) {
              nodes = nodes.concat(newNodes)
            } else {
              const index = nodes.indexOf(nodeIndex[parentId])
              const parent = nodes[index]
              nodes = [
                ...nodes.slice(0, index),
                {
                  ...parent,
                  comments: {
                    ...discussion.comments,
                    nodes: undefined
                  }
                },
                ...newNodes,
                ...nodes.slice(index + 1)
              ]
            }

            return {
              ...previousResult,
              discussion: {
                ...previousResult.discussion,
                ...discussion,
                comments: {
                  ...previousResult.discussion.comments,
                  // only update total and page info if root
                  ...(parentId ? {} : discussion.comments),
                  nodes
                }
              }
            }
          }
        })
      }
    })
  })
)(Comments)
