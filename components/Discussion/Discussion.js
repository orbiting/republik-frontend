import React from 'react'
import { useRouter } from 'next/router'

import DiscussionCommentComposer from './DiscussionCommentComposer'
import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'
import Comments from './Comments'
import TagFilter from './TagFilter'
import Loader from '../Loader'
import { useQuery } from '@apollo/client'
import { COMMENT_SUBSCRIPTION } from './graphql/documents'
import produce from '../../lib/immer'
import { bumpCounts, mergeComment, mergeComments } from './graphql/store'
import { debug } from './debug'
import { DISCUSSION_QUERY } from './DiscussionProvider/graphql/DiscussionQuery.graphql'

const DEFAULT_DEPTH = 3

const Discussion = ({
  discussionId,
  focusId = null,
  meta,
  board,
  parent,
  parentId = null,
  includeParent,
  rootCommentOverlay,
  showPayNotes
}) => {
  /*
   * DiscussionOrder ('HOT' | 'DATE' | 'VOTES' | 'REPLIES')
   * If 'AUTO' DiscussionOrder is returned by backend via resolvedOrderBy
   */
  const router = useRouter()
  const { query } = router
  const orderBy =
    query.order ||
    (board
      ? 'HOT'
      : discussionId === GENERAL_FEEDBACK_DISCUSSION_ID
      ? 'DATE'
      : 'AUTO')
  const activeTag = query.tag

  const depth = board ? 1 : DEFAULT_DEPTH

  const {
    data,
    error,
    loading,
    fetchMore,
    subscribeToMore,
    refetch,
    previousData
  } = useQuery(DISCUSSION_QUERY, {
    variables: {
      discussionId,
      orderBy,
      activeTag,
      parentId,
      depth: depth || 3,
      includeParent,
      focusId
    }
  })

  const discussionComments = {
    ...(data || previousData),
    refetch,
    fetchMore: ({
      parentId,
      after,
      appendAfter,
      depth,
      includeParent
    } = {}) => {
      return fetchMore({
        variables: {
          discussionId,
          parentId,
          after,
          orderBy,
          activeTag,
          depth: depth || 3,
          includeParent
        },
        updateQuery: (previousResult, { fetchMoreResult: { discussion } }) => {
          return produce(
            previousResult,
            mergeComments({
              parentId,
              appendAfter,
              comments: discussion.comments
            })
          )
        }
      })
    },
    subscribe: () => {
      return subscribeToMore({
        document: COMMENT_SUBSCRIPTION,
        variables: { discussionId },
        onError(...args) {
          debug('subscribe:onError', args)
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          debug('subscribe:updateQuery', subscriptionData.data)
          const initialParentId = parentId

          /*
           * Regardless of what we do here, the Comment object in the cache will be updated.
           * We only have to take care of updating objects other than the Comment, like in
           * this case update the Discussion object. This is why we only care about the
           * 'CREATED' mutation and ignore 'DELETED' (which can't happen anyways) and 'UPDATED'.
           */
          if (
            subscriptionData.data &&
            subscriptionData.data.comment.mutation === 'CREATED'
          ) {
            const comment = subscriptionData.data.comment.node

            if (
              initialParentId &&
              !comment.parentIds.includes(initialParentId)
            ) {
              return previousResult
            }

            /*
             * Ignore updates related to comments we created in the current client session.
             * If this is the first comment in the discussion, show it immediately. Otherwise
             * just bump the counts and let the user click the "Load More" buttons.
             */
            if (previousResult.discussion.comments.totalCount === 0) {
              return produce(
                previousResult,
                mergeComment({ comment, initialParentId })
              )
            } else {
              return produce(
                previousResult,
                bumpCounts({ comment, initialParentId })
              )
            }
          } else {
            return previousResult
          }
        }
      })
    }
  }

  return (
    <Loader
      loading={loading && !discussionComments.discussion}
      error={error}
      render={() => {
        if (!discussionComments.discussion) return null

        return (
          <div data-discussion-id={discussionId}>
            {!rootCommentOverlay && (
              <>
                <TagFilter discussion={discussionComments.discussion} />
                <DiscussionCommentComposer
                  discussionComments={discussionComments}
                  discussionId={discussionId}
                  parentId={parentId}
                  orderBy={orderBy}
                  depth={depth}
                  focusId={focusId}
                  includeParent={includeParent}
                  activeTag={activeTag}
                  showPayNotes={showPayNotes}
                />
              </>
            )}

            <div style={{ margin: rootCommentOverlay ? 0 : '20px 0' }}>
              <Comments
                key={
                  `${orderBy}-${activeTag ||
                    'all'}` /* To remount of the whole component on change */
                }
                discussionComments={discussionComments}
                discussionId={discussionId}
                parentId={parentId}
                orderBy={orderBy}
                depth={depth}
                focusId={board ? undefined : focusId}
                includeParent={includeParent}
                activeTag={activeTag}
                meta={meta}
                board={board}
                parent={board ? parent || focusId : undefined}
                rootCommentOverlay={rootCommentOverlay}
              />
            </div>
          </div>
        )
      }}
    />
  )
}

export default Discussion
