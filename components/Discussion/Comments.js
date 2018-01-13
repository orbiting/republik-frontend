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
  CommentTreeRow,
  Label
} from '@project-r/styleguide'

import mkDebug from 'debug'

const debug = mkDebug('comments')

const SHOW_DEBUG = false

const BlockLabel = ({children}) => <Label style={{display: 'block'}}>{children}</Label>

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
              const next = all[index + 1]
              const nextIsChild = next && next.parentIds.indexOf(comment.id) !== -1
              const nextIsThread = nextIsChild && comment.comments.directTotalCount === 1
              const prev = all[index - 1]
              const prevIsParent = prev && comment.parentIds.indexOf(prev.id) !== -1
              const prevIsThread = prevIsParent && prev.comments.directTotalCount === 1
              // const prevIsSibling = prev && comment.parentIds.every(parentId => prev.parentIds.indexOf(parentId) !== -1)

              const head = false // nextIsChild && !prevIsThread
              const tail = false // !nextIsChild && prevIsThread
              const otherChild = true || (
                comment.parentIds.length === 0 ||
                (prevIsParent && !prevIsThread)
              )

              SHOW_DEBUG && accumulator.list.push(<BlockLabel>{comment.parentIds.concat(comment.id).map(id => id.slice(0, 3)).join('-')}<br />{JSON.stringify({
                nextIsChild,
                prevIsParent,
                prevIsThread
              }, null, 2)}</BlockLabel>)
              accumulator.list.push(
                <CommentTreeRow
                  key={comment.id}
                  t={t}
                  visualDepth={accumulator.visualDepth}
                  head={head}
                  tail={tail}
                  otherChild={otherChild}
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

              const { counts } = accumulator
              accumulator.count += 1
              comment.parentIds.forEach(id => {
                counts[id] = (counts[id] || 0) + 1
              })

              if (nextIsChild) {
                const increaseDepth = !nextIsThread
                if (increaseDepth) {
                  accumulator.visualDepth += 1
                  SHOW_DEBUG && accumulator.list.push(<BlockLabel>inc</BlockLabel>)
                }
                accumulator.pendingClosure.push([
                  comment,
                  increaseDepth
                ])
              } else {
                const subCount = (subIdMap[comment.id] || []).length
                const total = comment.comments.totalCount + subCount
                if (total) {
                  accumulator.count += comment.comments.totalCount
                  accumulator.list.push(
                    <CommentTreeLoadMore
                      key={`loadMore${comment.id}`}
                      t={t}
                      connected
                      visualDepth={accumulator.visualDepth}
                      count={total}
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
                  .filter(([pending]) =>
                    !next ||
                    next.parentIds.indexOf(pending.id) === -1
                  )
                  .reverse()

                needsClosure.forEach(([comment, increaseDepth]) => {
                  if (increaseDepth) {
                    accumulator.visualDepth -= 1
                    SHOW_DEBUG && accumulator.list.push(<BlockLabel>dec</BlockLabel>)
                  }
                  const count = counts[comment.id] || 0
                  const subCount = (subIdMap[comment.id] || []).length
                  if (comment.comments.directTotalCount + subCount > count) {
                    // accumulator.list.push(<div>{comment.id} {count} {comment.comments.directTotalCount}</div>)
                    accumulator.count += comment.comments.totalCount - count
                    accumulator.list.push(
                      <CommentTreeLoadMore
                        key={`loadMore${comment.id}`}
                        t={t}
                        visualDepth={accumulator.visualDepth}
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
                  .filter((pending) => needsClosure.indexOf(pending) === -1)
              }

              return accumulator
            }, {
              count: 0,
              visualDepth: 1,
              list: [],
              pendingClosure: [],
              counts: {}
            })

          // discussion root load more
          const subCount = subIdMap.root.length

          const tailCount = totalCount - accumulator.count + subCount
          const tail = tailCount > 0 && (
            <CommentTreeLoadMore
              key='loadMore'
              t={t}
              visualDepth={1}
              count={tailCount}
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
