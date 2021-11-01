import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'

import { toRejectedString } from '../utils'
import { optimisticContent } from '../store'
import * as docs from '../documents'

/**
 * Provides the component with
 *
 *   {
 *     upvoteComment(commentId: ID)
 *     downvoteComment(commentId: ID)
 *     reportComment(commentId: ID)
 *     unpublishComment(commentId: ID)
 *     editComment(comment: Comment, content: string, tags?: string[])
 *   }
 */

export const withCommentActions = compose(
  graphql(docs.upvoteCommentMutation, {
    props: ({ mutate }) => ({
      upvoteComment: comment =>
        mutate({ variables: { commentId: comment.id } }).catch(toRejectedString)
    })
  }),
  graphql(docs.downvoteCommentMutation, {
    props: ({ mutate }) => ({
      downvoteComment: comment =>
        mutate({ variables: { commentId: comment.id } }).catch(toRejectedString)
    })
  }),
  graphql(docs.unvoteCommentMutation, {
    props: ({ mutate }) => ({
      unvoteComment: comment =>
        mutate({ variables: { commentId: comment.id } }).catch(toRejectedString)
    })
  }),
  graphql(docs.reportCommentMutation, {
    props: ({ mutate }) => ({
      reportComment: comment =>
        mutate({ variables: { commentId: comment.id } }).catch(toRejectedString)
    })
  }),
  graphql(docs.unpublishCommentMutation, {
    props: ({ mutate }) => ({
      unpublishComment: comment =>
        mutate({ variables: { commentId: comment.id } }).catch(toRejectedString)
    })
  }),
  graphql(docs.editCommentMutation, {
    props: ({ mutate }) => ({
      editComment: (comment, content, tags) => {
        return mutate({
          variables: { commentId: comment.id, content, tags },
          optimisticResponse: {
            __typename: 'Mutation',
            editComment: {
              ...comment,
              ...optimisticContent(content)
            }
          }
        }).catch(toRejectedString)
      }
    })
  })
)
