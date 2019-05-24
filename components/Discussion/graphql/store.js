/**
 * This module exports functions which are used to manipulate the apollo store.
 *
 *  - mergeComment(): Merge a single comment into a discussion.
 *  - mergeComments(): Merge a list of comments into a discussion.
 *  - optimisticContent(): …
 */

import { debug } from '../debug'

/**
 * Merge a single Comment into the Discussion (provided as a draft). This function
 * imperatively modifies the Discussion draft, it is meant to be used in conjunction
 * with immerjs produce().
 *
 * This merge algorithm is used from the submitComment() mutation (when the local
 * user submits a new comment) and also from the comments subscription when we receive
 * a new comment from the backend.
 */
export const mergeComment = ({ displayAuthor, comment }) => draft => {
  const parentId = comment.parentIds[comment.parentIds.length - 1]
  const nodes = draft.discussion.comments.nodes

  /*
   * We definitely have one more comment in this discussion. Also
   * increment 'directTotalCount' if it was a root comment.
   */
  draft.discussion.comments.totalCount += 1
  if (!parentId) {
    draft.discussion.comments.directTotalCount += 1
  }

  /*
   * Insert the new comment into the list. Where we insert it depends on who created
   * the comment. If it was created by the current user, we insert it at the front.
   * If it was another user, we insert it at the end.
   *
   * But do that only if the comment doesn't already exist, it may have arrived
   * in the client through a subscription.
   */
  if (!nodes.find(n => n.id === comment.id)) {
    const insertIndex = (() => {
      const parentIndex = nodes.findIndex(n => n.id === parentId)
      if (displayAuthor.id === comment.displayAuthor.id) {
        return parentIndex + 1
      } else {
        return parentIndex === -1 ? nodes.length : parentIndex
      }
    })()

    draft.discussion.comments.nodes.splice(insertIndex, 0, {
      ...comment,
      comments: {
        __typename: 'CommentConnection',
        totalCount: 0,
        directTotalCount: 0,
        pageInfo: emptyPageInfo()
      }
    })
  }

  /*
   * Update the counts in the 'CommentConnection' of all ancestors.
   */
  for (const ancestorId of comment.parentIds) {
    const node = nodes.find(n => n.id === ancestorId)
    if (node) {
      node.comments.totalCount += 1
      if (node.id === parentId) {
        node.comments.directTotalCount += 1
      }
    }
  }
}

/**
 * Merge multiple comments (a whole CommentConnection) into the Discussion draft. This
 * function is used in the discussionQuery fetchMore code path.
 */
export const mergeComments = ({ parentId, appendAfter, comments }) => (draft) => {
  const nodes = draft.discussion.comments.nodes

  /*
   * Create an index of the comments which we already have. With such an index we
   * can effiently find a particular comment by its Comment ID.
   *
   * Map<CommentID, number>, the value in this map is the index of the comment in
   * the nodes list.
   */
  const nodeIndex = new Map(nodes.map(({ id }, i) => ([id, i])))

  /*
   * Filter out any comments which we already have, for example because we received
   * them through a subscription.
   */
  const newNodes = comments.nodes.filter(node => !nodeIndex.has(node.id))

  if (parentId) {
    const parentIndex = nodeIndex.get(parentId)

    /*
     * Update the 'CommentConnection' of the parent comment.
     *
     * We clear 'nodes' because we don't need it. Though we shouldn't request it
     * in the query at all, it's likely a mistake if we requested it.
     */
    draft.discussion.comments.nodes[parentIndex].comments = {
      ...comments,
      nodes: undefined
    }

    /*
     * Insert the new nodes into the correct place in the list. We insert it right after
     * its parent, or after the 'appendAfter' comment if that is specified.
     */
    const insertIndex = (() => {
      if (appendAfter && nodeIndex.has(appendAfter.id)) {
        return nodeIndex.get(appendAfter.id) + 1
      } else {
        debug('fetchMore:append', 'node not found', insertIndex, { appendAfter, nodes })
        return parentIndex + 1
      }
    })()
    draft.discussion.comments.nodes.splice(insertIndex, 0, ...newNodes)
  } else {
    /*
     * If we fetched more root comments, update all CommentConnection fields
     * (totalCount, directTotalCount, pageInfo etc) on the discussion object
     * itself and append the new nodes to the end.
     */
    draft.discussion.comments = {
      ...comments,
      nodes: nodes.concat(newNodes)
    }
  }
}

export const optimisticContent = text => ({
  content: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: text }
        ]
      }
    ]
  },
  text
})

const emptyPageInfo = () => ({
  __typename: 'PageInfo',
  hasNextPage: false,
  endCursor: null
})
