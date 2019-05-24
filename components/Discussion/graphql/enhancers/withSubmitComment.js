import { graphql, compose } from 'react-apollo'
import uuid from 'uuid/v4'
import produce from 'immer'

import withT from '../../../../lib/withT'

import { withDiscussionDisplayAuthor } from './withDiscussionDisplayAuthor'
import { discussionQuery, submitCommentMutation } from '../documents'
import { toRejectedString } from '../utils'
import { mergeComment, optimisticContent } from '../store'
import { debug } from '../../debug'

/**
 * Provides the component with
 *
 *   {
 *     submitComment(parent: Comment, content: string, tags?: string[])
 *   }
 */

export const withSubmitComment = compose(
  withT,
  withDiscussionDisplayAuthor,
  graphql(submitCommentMutation, {
    props: ({ ownProps: { t, discussionId, parentId: ownParentId, orderBy, depth, focusId, discussionDisplayAuthor }, mutate }) => ({
      submitComment: (parent, content, tags = []) => {
        if (!discussionDisplayAuthor) {
          return Promise.reject(t('submitComment/noDisplayAuthor'))
        }
        // Generate a new UUID for the comment. We do this client-side so that we can
        // properly handle subscription notifications.
        const id = uuid()

        const parentId = parent ? parent.id : null
        const parentIds = parent
          ? parent.parentIds.concat(parentId)
          : []

        return mutate({
          variables: { discussionId, parentId, id, content, tags },
          optimisticResponse: {
            __typename: 'Mutation',
            submitComment: {
              id,
              ...optimisticContent(content),
              published: true,
              adminUnpublished: false,
              userCanEdit: true,
              downVotes: 0,
              upVotes: 0,
              userVote: null,
              displayAuthor: discussionDisplayAuthor,
              createdAt: (new Date()).toISOString(),
              updatedAt: (new Date()).toISOString(),
              parentIds,
              tags,
              __typename: 'Comment'
            }
          },
          update: (proxy, { data: { submitComment } }) => {
            debug('submitComment', submitComment.id, submitComment)
            const variables = {
              discussionId,
              parentId: ownParentId,
              after: null,
              orderBy,
              depth,
              focusId
            }

            const data = proxy.readQuery({
              query: discussionQuery,
              variables
            })

            proxy.writeQuery({
              query: discussionQuery,
              variables,
              data: produce(data, mergeComment({
                displayAuthor: discussionDisplayAuthor,
                comment: submitComment
              }))
            })
          }
        }).catch(toRejectedString)
      }
    })
  })
)
