import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { COMMENT_SUBSCRIPTION } from '../../Discussion/graphql/documents'
import produce from '../../../lib/immer'
import {
  bumpCounts,
  mergeComment,
  mergeComments
} from '../../Discussion/graphql/store'

import { ENHANCED_DISCUSSION_QUERY } from '../graphql/DiscussionQuery.graphql'

// TODO: Type the discussion object!
type DiscussionData = {
  discussion: any
}

type CommentSubscriptionData = {
  comment: any
}

type DiscussionOptions = {
  orderBy: string
  activeTag?: string
  depth?: number
  focusId?: string
  parentId?: string
  first?: number
}

function useDiscussionData(discussionId: string, options?: DiscussionOptions) {
  const {
    data: { discussion } = {},
    error,
    loading,
    fetchMore,
    subscribeToMore,
    refetch
  } = useQuery<DiscussionData>(ENHANCED_DISCUSSION_QUERY, {
    variables: {
      discussionId,
      orderBy: options.orderBy,
      activeTag: options.activeTag,
      depth: options.depth,
      focusId: options.focusId,
      first: options.first || 100
    },
    onCompleted: () => {
      console.debug('Finished fetching discussion data', discussion, {
        variables: {
          discussionId,
          orderBy: options.orderBy,
          activeTag: options.activeTag,
          depth: options.depth,
          focusId: options.focusId
        }
      })
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
        console.debug('Upading Discussion Query:', {
          variables: {
            discussionId,
            parentId,
            after,
            orderBy: options.orderBy,
            activeTag: options.activeTag,
            depth: depth || 3,
            includeParent
          }
        })
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

  const subscribeToComments = subscribeToMore<CommentSubscriptionData>({
    document: COMMENT_SUBSCRIPTION,
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
    if (discussion && subscribeToComments) {
      subscribeToComments()
    }
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
