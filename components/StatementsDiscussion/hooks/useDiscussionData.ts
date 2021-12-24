import { useQuery } from '@apollo/client'
import {
  commentsSubscription,
  DISCUSSION_QUERY
} from '../../Discussion/graphql/documents'
import produce from '../../../lib/immer'
import {
  bumpCounts,
  mergeComment,
  mergeComments
} from '../../Discussion/graphql/store'
import { useEffect } from 'react'

type DiscussionOptions = {
  orderBy: string
  activeTag?: string
  depth?: number
  focusId?: string
  parentId?: string
}

function useDiscussionData(discussionId: string, options?: DiscussionOptions) {
  const {
    data: { discussion } = {},
    error,
    loading,
    fetchMore,
    subscribeToMore,
    refetch
  } = useQuery(DISCUSSION_QUERY, {
    variables: {
      discussionId,
      orderBy: options.orderBy,
      activeTag: options.activeTag,
      depth: options.depth,
      focusId: options.focusId
    }
  })

  /**
   * Merge previous and next comments when fetching more
   * @param parentId
   * @param after
   * @param appendAfter
   * @param depth
   * @param includeParent
   */
  const enhancedFetchMore = ({
    parentId,
    after,
    appendAfter,
    depth,
    includeParent
  }) =>
    fetchMore({
      variables: {
        discussionId,
        parentId,
        after,
        orderBy: options.orderBy,
        activeTag: options.activeTag,
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

  const subscribeToComments = subscribeToMore({
    document: commentsSubscription,
    variables: { discussionId },
    onError(...args) {
      console.debug('subscribe:onError', args)
    },
    updateQuery: (previousResult, { subscriptionData }) => {
      console.debug('subscribe:updateQuery', subscriptionData.data)
      const initialParentId = options.parentId

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

        if (initialParentId && !comment.parentIds.includes(initialParentId)) {
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
            mergeComment({
              comment,
              initialParentId,
              activeTag: options.activeTag
            })
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

  useEffect(() => {
    subscribeToComments()
  }, [discussion, subscribeToComments])

  return {
    discussion,
    loading,
    error,
    refetch,
    fetchMore: enhancedFetchMore
  }
}

export default useDiscussionData
