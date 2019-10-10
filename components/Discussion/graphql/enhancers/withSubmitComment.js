import { graphql, compose } from 'react-apollo'
import uuid from 'uuid/v4'
import produce from 'immer'

import withT from '../../../../lib/withT'

import { withDiscussionDisplayAuthor } from './withDiscussionDisplayAuthor'
import { discussionQuery, submitCommentMutation } from '../documents'
import { toRejectedString } from '../utils'
import { mergeComment, optimisticContent, submittedComments } from '../store'
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
    props: ({
      ownProps: {
        t,
        discussionId,
        parentId: ownParentId,
        orderBy,
        depth,
        focusId,
        discussionDisplayAuthor: displayAuthor,
        discussionUserPreference: userPreference
      },
      mutate
    }) => ({
      submitComment: (parent, content, tags = []) => {
        if (!displayAuthor) {
          return Promise.reject(t('submitComment/noDisplayAuthor'))
        }

        /*
         * Generate a new UUID for the comment. We do this client-side so that we can
         * properly handle subscription notifications.
         */
        const id = uuid()
        submittedComments.add(id)

        const { parentId, parentIds } = parent
          ? { parentId: parent.id, parentIds: parent.parentIds.concat(parent.id) }
          : { parentId: null, parentIds: [] }

        return mutate({
          variables: { discussionId, parentId, id, content, tags },
          optimisticResponse: {
            __typename: 'Mutation',
            submitComment: {
              __typename: 'Comment',
              id,
              ...optimisticContent(content),
              published: true,
              adminUnpublished: false,
              userCanEdit: true,
              downVotes: 0,
              upVotes: 0,
              userVote: null,
              displayAuthor,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              parentIds,
              tags,
              discussion: {
                __typename: 'Discussion',
                id: discussionId,
                userPreference: {
                  __typename: 'DiscussionPreferences',
                  notifications: userPreference.notifications
                },
                userWaitUntil: null
              }
            }
          },
          update: (proxy, { data: { submitComment: comment } }) => {
            debug('submitComment', comment)
            const variables = {
              discussionId,
              parentId: ownParentId,
              after: null,
              orderBy,
              depth,
              focusId
            }

            proxy.writeQuery({
              query: discussionQuery,
              variables,
              data: produce(
                proxy.readQuery({ query: discussionQuery, variables }),
                mergeComment({ displayAuthor, comment })
              )
            })
          }
        }).catch(toRejectedString)
      }
    })
  })
)
