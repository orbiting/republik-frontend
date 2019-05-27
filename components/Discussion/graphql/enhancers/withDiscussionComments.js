import { graphql } from 'react-apollo'
import produce from 'immer'

import { debug } from '../../debug'
import { bumpCounts, mergeComments, submittedComments, mergeComment } from '../store'
import { discussionQuery, commentsSubscription } from '../documents'

/**
 * Provides the component with
 *
 *   {
 *     discussionComments: {
 *       …data // discussionQuery Result
 *       fetchMore({ parentId, after, appendAfter, depth })
 *       subscribe()
 *     }
 *   }
 */

export const withDiscussionComments = graphql(discussionQuery, {
  props: ({ ownProps: { discussionId, orderBy }, data: { fetchMore, subscribeToMore, ...data } }) => ({
    discussionComments: {
      ...data,
      fetchMore: ({ parentId, after, appendAfter, depth } = {}) => {
        return fetchMore({
          variables: { discussionId, parentId, after, orderBy, depth: depth || parentId ? 3 : 1 },
          updateQuery: (previousResult, { fetchMoreResult: { discussion } }) => {
            return produce(previousResult, mergeComments({ parentId, appendAfter, comments: discussion.comments }))
          }
        })
      },
      subscribe: () => {
        return subscribeToMore({
          document: commentsSubscription,
          variables: { discussionId },
          onError (...args) {
            debug('subscribe:onError', args)
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            debug('subscribe:updateQuery', subscriptionData.data)

            /*
             * Regardless of what we do here, the Comment object in the cache will be updated.
             * We only have to take care of updating objects other than the Comment, like in
             * this case update the Discussion object. This is why we only care about the
             * 'CREATED' mutation and ignore 'DELETED' (which can't happen anyways) and 'UPDATED'.
             */
            if (subscriptionData.data && subscriptionData.data.comment.mutation === 'CREATED') {
              const comment = subscriptionData.data.comment.node

              /*
               * Ignore updates related to comments we created in the current client session.
               * If this is the first comment in the discussion, show it immediately. Otherwise
               * just bump the counts and let the user click the "Load More" buttons.
               */
              if (submittedComments.has(comment.id)) {
                return previousResult
              } else if (previousResult.discussion.comments.totalCount === 0) {
                return produce(previousResult, mergeComment({ comment }))
              } else {
                return produce(previousResult, bumpCounts({ comment }))
              }
            } else {
              return previousResult
            }
          }
        })
      }
    }
  })
})
