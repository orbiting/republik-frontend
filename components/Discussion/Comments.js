import React, { PureComponent, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'

import withT from '../../lib/withT'
import timeahead from '../../lib/timeahead'
import timeago from '../../lib/timeago'

import { withDiscussionDisplayAuthor, downvoteComment, upvoteComment, editComment, unpublishComment, isAdmin, query, submitComment, commentsSubscription } from './enhancers'
import DiscussionPreferences from './DiscussionPreferences'
import SecondaryActions from './SecondaryActions'

import {
  Loader,
  CommentTreeLoadMore,
  CommentTreeCollapse,
  CommentTreeRow,
  Label,
  colors
} from '@project-r/styleguide'

import { Link } from '../../lib/routes'
import { focusSelector } from '../../lib/utils/scroll'
import PathLink from '../Link/Path'

import mkDebug from 'debug'

const debug = mkDebug('comments')

const SHOW_DEBUG = false

const BlockLabel = ({ children }) => <Label style={{ display: 'block' }}>{children}</Label>

const mergeCounts = (a, b) => {
  return {
    ...a,
    ...Object.keys(b).reduce(
      (merge, key) => {
        merge[key] = (a[key] || 0) + b[key]
        return merge
      },
      {}
    )
  }
}

class Comments extends PureComponent {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      subIdMap: {
        root: []
      },
      showPreferences: false,
      maxVisualDepth: 3,
      closedPortals: {},
      hasFocus: !!props.focusId
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

    this.submitComment = (parent, ...args) => {
      return this.props.submitComment(parent, ...args)
        .then(() => {
          if (parent) {
            this.setState(({ closedPortals }) => ({
              closedPortals: {
                ...closedPortals,
                [parent.id]: false
              }
            }))
          }
        })
    }
  }
  clearSubIds (parentId) {
    this.setState(({ subIdMap }) => {
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
        this.setState(({ subIdMap }) => {
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
    this.fetchFocus()
  }
  componentDidUpdate (prevProps, prevState) {
    this.fetchFocus()
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.reload !== nextProps.reload) {
      this.props.data.refetch()
    }
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  fetchFocus () {
    const {
      t,
      data: { discussion, loading },
      fetchMore, focusId
    } = this.props
    if (loading) {
      return
    }
    const focusInfo = discussion && discussion.comments.focus
    const hasFocus = !!focusInfo
    if (focusId && !focusInfo) {
      this.setState({
        focusError: t('discussion/focus/notFound'),
        focusLoading: false
      })
      return
    }
    const nodes = discussion && discussion.comments.nodes
    const focus = (
      focusInfo &&
      nodes.find(comment => comment.id === focusInfo.id)
    )
    if (this.state.focus !== focus || this.state.hasFocus !== hasFocus) {
      this.setState({
        focus,
        hasFocus,
        focusError: undefined
      }, () => {
        if (focusInfo) {
          focusSelector(`[data-comment-id='${focusInfo.id}']`)
        }
      })
    }
    if (!focusInfo) {
      return
    }
    if (!focus && !this.state.focusLoading && !this.state.focusError) {
      const parentIds = focusInfo.parentIds
      const closestParent = [].concat(parentIds).reverse().reduce((parent, id) => {
        if (parent) return parent
        return nodes.find(node => node.id === id)
      }, null)
      if (!closestParent) {
        this.setState({ focusError: t('discussion/focus/missing') })
        return
      }
      const parentIndex = parentIds.indexOf(closestParent.id)
      const depth = parentIds.length - parentIndex
      this.setState({ focusLoading: true })
      fetchMore(closestParent.id, undefined, { depth })
        .then(() => {
          this.setState({
            focusLoading: false,
            focusError: undefined
          }, () => {
            focusSelector(`[data-comment-id='${focusInfo.id}']`)
          })
        })
        .catch(() => {
          this.setState({
            focusError: t('discussion/focus/loadError'),
            focusLoading: false
          })
        })
    }
  }
  renderComments (nodes, options = {}) {
    const {
      discussionDisplayAuthor,
      t,
      fetchMore,
      discussionUserCanComment,
      discussionClosed,
      data: { discussion },
      now,
      shareComment
    } = this.props

    const CommentLink = ({ displayAuthor, commentId, children, ...props }) => {
      if (displayAuthor && displayAuthor.username) {
        return <Link route='profile' params={{ slug: displayAuthor.username }} {...props}>
          {children}
        </Link>
      }
      if (commentId) {
        if (discussion.documentPath) {
          return <PathLink path={discussion.documentPath} query={{ focus: commentId }} replace scroll={false} {...props}>
            {children}
          </PathLink>
        }
        return <Link route='discussion' params={{ id: discussion.id, focus: commentId }} {...props}>
          {children}
        </Link>
      }
      return children
    }

    const displayAuthor = (
      discussionUserCanComment && !discussionClosed && discussionDisplayAuthor
    ) || undefined

    const {
      subIdMap,
      maxVisualDepth,
      closedPortals,
      focus
    } = this.state

    const focusId = focus && focus.id

    const {
      pendingClosure = [],
      count = 0,
      counts = {},
      moreCounts = {},
      directCounts = {}
    } = options
    const initialState = {
      list: [],
      visualDepth: 1,
      pendingClosure,
      count,
      counts,
      moreCounts,
      directCounts
    }

    const timeagoFromNow = (createdAtString) => {
      return timeago(t, (now - Date.parse(createdAtString)) / 1000)
    }

    const closePending = (accumulator, { next, appendAfter }) => {
      const { counts, moreCounts, directCounts } = accumulator
      const needsClosure = accumulator.pendingClosure
        .filter(([pending]) =>
          !next ||
          next.parentIds.indexOf(pending.id) === -1
        )
        .reverse()

      needsClosure.forEach(([comment, increasedDepth, isRoot]) => {
        if (increasedDepth) {
          accumulator.visualDepth -= 1
          SHOW_DEBUG && accumulator.list.push(<BlockLabel>dec {comment.id.slice(0, 3)}</BlockLabel>)
        }
        const directCount = directCounts[comment.id] || 0
        const subCount = (subIdMap[comment.id] || []).length
        if (comment.comments.directTotalCount + subCount > directCount) {
          const count = counts[comment.id] || 0
          const moreCount = moreCounts[comment.id] || 0
          const leftCount = comment.comments.totalCount - count - moreCount
          comment.parentIds.forEach(id => {
            moreCounts[id] = (moreCounts[id] || 0) + leftCount
          })
          accumulator.count += comment.comments.totalCount - count
          accumulator.list.push(
            <CommentTreeLoadMore
              key={`loadMore${comment.id}`}
              t={t}
              connected={!isRoot}
              visualDepth={isRoot ? 0 : accumulator.visualDepth}
              count={leftCount + subCount}
              onClick={() => {
                fetchMore(comment.id, comment.comments.pageInfo.endCursor, { appendAfter })
                  .then(() => {
                    this.clearSubIds(comment.id)
                  })
              }}
            />
          )
        } else if (accumulator.visualDepth === 1) {
          accumulator.list.push(<div key={`br${comment.id}`} style={{ height: 10 }} />)
        }
      })
      accumulator.pendingClosure = accumulator.pendingClosure
        .filter((pending) => needsClosure.indexOf(pending) === -1)
    }

    return nodes.reduce((accumulator, comment, index, all) => {
      let prev = all[index - 1]
      const next = all[index + 1]

      const { portal } = accumulator
      if (portal) {
        portal.nodes.push(comment)

        const nextBelongsToPortal = next && portal.parentIds.every(parentId => next.parentIds.indexOf(parentId) !== -1)
        if (nextBelongsToPortal) {
          return accumulator
        }
        // close portal
        const portalId = portal.parent.id
        const portalAccumulator = this.renderComments(
          portal.nodes,
          {
            pendingClosure: [
              [portal.parent, false, true]
            ]
          }
        )
        if (closedPortals[portalId]) {
          accumulator.list.push(
            <CommentTreeLoadMore
              key={`openPortal${portalId}`}
              t={t}
              connected
              visualDepth={portal.visualDepth}
              count={portalAccumulator.count}
              onClick={() => {
                this.setState(({ closedPortals }) => ({
                  closedPortals: {
                    ...closedPortals,
                    [portalId]: false
                  }
                }))
              }}
            />
          )
        } else {
          accumulator.list.push(
            <Fragment key={`portal${portalId}`}>
              <CommentTreeCollapse
                t={t}
                visualDepth={accumulator.visualDepth}
                onClick={() => {
                  this.setState(({ closedPortals }) => ({
                    closedPortals: {
                      ...closedPortals,
                      [portalId]: true
                    }
                  }))
                }}
              />
              {portalAccumulator.list}
              <div style={{
                marginTop: '-2px',
                borderTop: `2px solid ${colors.primary}`
              }} />
            </Fragment>

          )
        }
        accumulator.count += portalAccumulator.count

        accumulator.counts = mergeCounts(
          accumulator.counts,
          portalAccumulator.counts
        )
        accumulator.moreCounts = mergeCounts(
          accumulator.moreCounts,
          portalAccumulator.moreCounts
        )
        accumulator.directCounts = mergeCounts(
          accumulator.directCounts,
          portalAccumulator.directCounts
        )
        accumulator.portal = undefined

        closePending(accumulator, {
          next,
          appendAfter: comment
        })
        return accumulator
      }

      const prevIsParent = !!prev && comment.parentIds.indexOf(prev.id) !== -1
      const prevIsThread = prevIsParent && prev.comments.directTotalCount === 1

      const nextIsChild = !!next && next.parentIds.indexOf(comment.id) !== -1
      const nextIsThread = nextIsChild && comment.comments.directTotalCount === 1

      const subCount = (subIdMap[comment.id] || []).length
      const hasChildren = comment.comments.totalCount + subCount > 0

      const head = (nextIsChild || hasChildren) && !prevIsThread
      const tail = prevIsThread && !(nextIsChild || hasChildren)
      // const end = (
      //   !(nextIsChild || hasChildren) && (
      //     !next || next.parentIds.length < comment.parentIds.length
      //   )
      // )
      const otherChild = (
        !nextIsChild && !hasChildren && (
          (comment.parentIds.length === 0) ||
          (!prevIsThread && !nextIsThread)
        )
      )

      const timeAheadFromNow = (dateString) => {
        return timeahead(t, (now - Date.parse(dateString)) / 1000)
      }
      const waitUntilDate = discussion.userWaitUntil && new Date(discussion.userWaitUntil)
      const replyBlockedMsg = (
        waitUntilDate &&
        waitUntilDate > now &&
        t('styleguide/CommentComposer/wait', { time: timeAheadFromNow(waitUntilDate) })
      ) || ''

      SHOW_DEBUG && accumulator.list.push(<BlockLabel>{comment.parentIds.concat(comment.id).map(id => id.slice(0, 3)).join('-')}<br />{JSON.stringify({
        head,
        tail,
        otherChild
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
          highlighted={focusId === comment.id}
          displayAuthor={displayAuthor}
          onEditPreferences={this.showPreferences}
          isAdmin={this.props.isAdmin}
          submitComment={this.submitComment}
          editComment={this.props.editComment}
          upvoteComment={this.props.upvoteComment}
          downvoteComment={this.props.downvoteComment}
          unpublishComment={(...args) => {
            const message = t(`styleguide/CommentActions/unpublish/confirm${comment.userCanEdit ? '' : '/admin'}`, {
              name: comment.displayAuthor.name
            })
            if (!window.confirm(message)) {
              return Promise.reject(new Error())
            }
            return this.props.unpublishComment(...args)
          }}
          timeago={timeagoFromNow}
          maxLength={discussion && discussion.rules && discussion.rules.maxLength}
          replyBlockedMsg={replyBlockedMsg}
          Link={CommentLink}
          secondaryActions={<SecondaryActions />}
          collapsable={discussion && discussion.collapsable}
          onShare={shareComment ? () => { shareComment(discussion.documentPath, comment.id) } : undefined}
        />
      )

      const { directCounts, moreCounts, counts } = accumulator
      accumulator.count += 1
      comment.parentIds.forEach(id => {
        counts[id] = (counts[id] || 0) + 1
      })
      const parentId = comment.parentIds[comment.parentIds.length - 1]
      if (parentId) {
        directCounts[parentId] = (directCounts[parentId] || 0) + 1
      }

      if (nextIsChild) {
        const increaseDepth = !nextIsThread
        if (increaseDepth) {
          if (accumulator.visualDepth + 1 > maxVisualDepth) {
            // open a portal
            accumulator.portal = {
              visualDepth: accumulator.visualDepth,
              parent: comment,
              parentIds: next.parentIds,
              nodes: []
            }
            // return early
            return accumulator
          }
          accumulator.visualDepth += 1
          SHOW_DEBUG && accumulator.list.push(<BlockLabel>inc</BlockLabel>)
        }
        accumulator.pendingClosure.push([
          comment,
          increaseDepth
        ])

        // return early
        return accumulator
      }

      // next not a child
      if (hasChildren) {
        comment.parentIds.forEach(id => {
          moreCounts[id] = (moreCounts[id] || 0) + comment.comments.totalCount
        })
        accumulator.count += comment.comments.totalCount
        accumulator.list.push(
          <CommentTreeLoadMore
            key={`loadMore${comment.id}`}
            t={t}
            connected
            visualDepth={accumulator.visualDepth}
            count={comment.comments.totalCount + subCount}
            onClick={() => {
              fetchMore(comment.id, comment.comments.pageInfo.endCursor)
                .then(() => {
                  this.clearSubIds(comment.id)
                })
            }}
          />
        )
      }

      closePending(accumulator, {
        next,
        appendAfter: comment
      })

      return accumulator
    }, initialState)
  }
  render () {
    const {
      discussionId,
      t,
      data: { loading, error, discussion },
      fetchMore
    } = this.props

    const {
      showPreferences,
      subIdMap,
      hasFocus,
      focusLoading
    } = this.state

    return (
      <Loader
        loading={loading || (hasFocus && focusLoading)}
        error={error || (discussion === null && t('discussion/missing'))}
        render={() => {
          const { totalCount, pageInfo, nodes } = discussion.comments

          const accumulator = this.renderComments(nodes)

          // discussion root load more
          const subCount = subIdMap.root.length

          const tailCount = totalCount - accumulator.count + subCount
          const tail = tailCount > 0 && (
            <CommentTreeLoadMore
              key='loadMore'
              t={t}
              visualDepth={0}
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

          return (
            <Fragment>
              {accumulator.list}
              <br />
              {tail}
              {discussionPreferences}
            </Fragment>
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
    props: ({ ownProps: { discussionId, orderBy }, data: { fetchMore, subscribeToMore, ...data } }) => ({
      data,
      fetchMore: (parentId, after, { appendAfter, depth } = {}) => {
        return fetchMore({
          variables: { discussionId, parentId, after, orderBy, depth: depth || parentId ? 3 : 1 },
          updateQuery: (previousResult, { fetchMoreResult: { discussion } }) => {
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
              if (appendAfter && appendAfter.id !== parent.id) {
                appendIndex = nodes.indexOf(nodeIndex[appendAfter.id])
                if (appendIndex === -1) {
                  appendIndex = 0
                  debug('fetchMore:append', 'node not found', appendIndex, { appendAfter, nodes })
                }
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
      subscribe: ({ onCreate }) => {
        return subscribeToMore({
          document: commentsSubscription,
          variables: {
            discussionId
          },
          onError (...args) {
            debug('subscribe:onError', args)
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return previousResult
            }

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
