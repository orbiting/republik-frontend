import React, {PureComponent} from 'react'
import { compose, graphql } from 'react-apollo'

import { errorToString } from '../../lib/utils/errors'

import withT from '../../lib/withT'
import timeago from '../../lib/timeago'

import Loader from '../Loader'

import { withDiscussionDisplayAuthor, downvoteComment, upvoteComment, editComment, unpublishComment, isAdmin, query, submitComment, commentsSubscription } from './enhancers'
import DiscussionPreferences from './DiscussionPreferences'

import {
  colors,
  CommentTreeLoadMore,
  CommentTreeCollapse,
  CommentTreeRow
} from '@project-r/styleguide'

import mkDebug from 'debug'

const debug = mkDebug('comments')

class Comments extends PureComponent {
  constructor (...args) {
    super(...args)

    this.state = {
      subIdMap: {
        root: []
      },
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
  clearSubIds (parentId) {
    this.setState(({subIdMap}) => {
      const { nodes } = this.props.data.discussion.comments

      const subIds = (subIdMap[parentId] || [])
            .filter(id => !nodes.find(c => c.id === id))
      debug('clearSubIds', parentId, subIds)
      return {
        subIdMap: {
          ...subIdMap,
          [parentId]: subIds
        }
      }
    })
  }
  componentDidMount () {
    this.unsubscribe = this.props.subscribe({
      onCreate: (comment, parentId = 'root') => {
        this.setState(({subIdMap}) => {
          const subIds = subIdMap[parentId] || []
          subIds.push(comment.id)

          debug('onCreate', parentId, subIds)
          return {
            subIdMap: {
              ...subIdMap,
              [parentId]: subIds
            }
          }
        })
      }
    })
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
      discussionId,
      discussionDisplayAuthor: displayAuthor,
      t,
      data: {loading, error, discussion},
      fetchMore
    } = this.props

    const {
      now, showPreferences,
      subIdMap
    } = this.state
    const timeagoFromNow = (createdAtString) => {
      return timeago(t, (now - Date.parse(createdAtString)) / 1000)
    }

    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          const {totalCount, pageInfo, nodes} = discussion.comments

          const accumulator = nodes
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
              accumulator.count += 1

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
                const subCount = (subIdMap[comment.id] || []).length
                const total = comment.comments.totalCount + subCount
                if (total > count) {
                  accumulator.count += comment.comments.totalCount - count
                  accumulator.list.push(
                    <CommentTreeLoadMore
                      key={`loadMore${comment.id}`}
                      t={t}
                      connected
                      visualDepth={comment.parentIds.length + 1}
                      count={total - count}
                      onClick={() => {
                        fetchMore(comment.id, comment.comments.pageInfo.endCursor)
                          .then(() => {
                            this.clearSubIds(comment.id)
                          })
                      }}
                    />
                  )
                }

                const appendAfter = comment
                const needsClosure = accumulator.pendingClosure
                  .filter(pending => comment.parentIds.indexOf(pending.id) === -1)
                needsClosure.forEach(comment => {
                  const count = counts[comment.id] || 0
                  const subCount = (subIdMap[comment.id] || []).length
                  if (comment.comments.directTotalCount + subCount > count) {
                    // accumulator.list.push(<div>{comment.id} {count} {comment.comments.directTotalCount}</div>)
                    accumulator.count += comment.comments.totalCount - count
                    accumulator.list.push(
                      <CommentTreeLoadMore
                        key={`loadMore${comment.id}`}
                        t={t}
                        visualDepth={comment.parentIds.length + 1}
                        count={comment.comments.totalCount + subCount - count}
                        onClick={() => {
                          fetchMore(comment.id, comment.comments.pageInfo.endCursor, {appendAfter})
                            .then(() => {
                              this.clearSubIds(comment.id)
                            })
                        }}
                      />
                    )
                  }
                })
                accumulator.pendingClosure = accumulator.pendingClosure
                  .filter(pending => needsClosure.indexOf(pending) === -1)
              }

              return accumulator
            }, {
              count: 0,
              visualDepth: 1,
              list: [],
              pendingClosure: [],
              counts: {}
            })

          // This is the 'CommentTreeLoadMore' element which loads more comments in the discussion root.
          const subCount = subIdMap.root.length
          const tail = pageInfo && pageInfo.hasNextPage && (
            <CommentTreeLoadMore
              key='loadMore'
              t={t}
              visualDepth={1}
              count={totalCount - accumulator.count + subCount}
              onClick={() => {
                fetchMore(null, pageInfo.endCursor)
                  .then(() => {
                    this.clearSubIds('root')
                  })
              }}
            />
          )

          const discussionPreferences = showPreferences && (
            <DiscussionPreferences
              key='discussionPreferenes'
              discussionId={discussionId}
              onClose={this.closePreferences}
            />
          )

          return accumulator
            .list
            .concat(
              tail,
              discussionPreferences
            )
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
      fetchMore: (parentId, after, {appendAfter} = {}) => {
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
              const parentIndex = nodes.indexOf(nodeIndex[parentId])
              const parent = nodes[parentIndex]
              nodes = [
                ...nodes.slice(0, parentIndex),
                {
                  ...parent,
                  comments: {
                    ...discussion.comments,
                    nodes: undefined
                  }
                },
                ...nodes.slice(parentIndex + 1)
              ]
              let appendIndex = parentIndex
              if (appendAfter) {
                appendIndex = nodes.indexOf(nodeIndex[appendAfter.id])
              }
              nodes.splice(appendIndex + 1, 0, ...newNodes)
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
      },
      subscribe: ({onCreate}) => {
        return subscribeToMore({
          document: commentsSubscription,
          variables: {
            discussionId
          },
          onError (...args) {
            debug('subscribe:onError', args)
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            const { node: comment, mutation } = subscriptionData.data.comment
            debug('subscribe:updateQuery', mutation, comment)

            if (mutation !== 'CREATED') {
              return previousResult
            }

            const nodes = previousResult.discussion.comments.nodes

            const existingNode = nodes.find(c => c.id === comment.id)
            if (existingNode) {
              debug('subscribe:updateQuery', 'existing')
              return previousResult
            }

            const firstLocalParent = []
              .concat(comment.parentIds)
              .reverse()
              .find(parentId => {
                return nodes.find(c => c.id === parentId)
              })
            debug('subscribe:onCreate', 'firstLocalParent', firstLocalParent)
            onCreate(comment, firstLocalParent)

            return previousResult
          }
        })
      }
    })
  })
)(Comments)
