/**
 * This module exports functions which are used to manipulate the apollo store, and
 * a other functions which are used from multiple enhancers.
 *
 *  - mergeComment(): Merge a single comment into a discussion.
 *  - mergeComments(): Merge a list of comments into a discussion.
 *  - optimisticContent(): …
 */

import { debug } from '../debug'

/**
 * Merge a single Comment into the Discussion (provided as a draft). This function is
 * from the submitComment mutation update function to merge the just created comment
 * into the discussion.
 */
export const mergeComment = ({ comment }) => draft => {
  const parentId = comment.parentIds[comment.parentIds.length - 1]
  const nodes = draft.discussion.comments.nodes

  /*
   * Insert the new comment just after its parent in the nodes list. This ensures
   * that the comment shows up as the first reply to the parent.
   */
  const insertIndex = 1 + nodes.findIndex(n => n.id === parentId)
  draft.discussion.comments.nodes.splice(insertIndex, 0, {
    ...comment,
    comments: emptyCommentsConnection
  })

  bumpCounts({ comment })(draft)
}

/**
 * Give a new comment, bump the counts (totalCount, directTotalCount)
 */
export const bumpCounts = ({ comment }) => draft => {
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
export const mergeComments = ({ parentId, appendAfter, comments }) => draft => {
  const nodes = draft.discussion.comments.nodes

  /*
   * Create an index of the comments which we already have. With such an index we
   * can effiently find a particular comment by its Comment ID.
   *
   * Map<CommentID, number>, the value in this map is the index of the comment in
   * the nodes list.
   */
  const nodeIndex = new Map(nodes.map(({ id }, i) => [id, i]))

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
      if (appendAfter) {
        if (nodeIndex.has(appendAfter)) {
          return nodeIndex.get(appendAfter) + 1
        } else {
          /*
           * If we hit this, we have a bug somewhere.
           */
          debug('mergeComments: node not found', { appendAfter })
          return parentIndex + 1
        }
      } else {
        /*
         * No appendAfter specified, append to the end of the list.
         */
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
        children: [{ type: 'text', value: text }]
      }
    ]
  },
  text
})

const emptyPageInfo = {
  __typename: 'PageInfo',
  hasNextPage: false,
  endCursor: null
}

const emptyCommentsConnection = {
  __typename: 'CommentConnection',
  totalCount: 0,
  directTotalCount: 0,
  pageInfo: emptyPageInfo,
  nodes: []
}

/**
 * UUIDs of comment which we submitted from the current client session. We store
 * this so we can ignore updates which come through the discussion subscription.
 *
 * We only add to this set, we never remove elements from it. This is fine, each
 * element is really small (a UUID string) and users will not submit that many
 * comments in a single session.
 *
 * @see withDiscussionComments and withSubmitComment
 */
export const submittedComments = new Set()
