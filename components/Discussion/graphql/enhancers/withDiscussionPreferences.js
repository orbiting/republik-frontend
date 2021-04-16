import { graphql, compose } from 'react-apollo'

import produce from '../../../../lib/immer'

import {
  discussionPreferencesQuery,
  setDiscussionPreferencesMutation
} from '../documents'
import { toRejectedString } from '../utils'

/**
 * Provides the component with:
 *
 *   {
 *     discussionPreferences: { … } // discussionPreferencesQuery Result
 *     setDiscussionPreferences(anonimity, credential, notifications)
 *   }
 */

export const withDiscussionPreferences = compose(
  graphql(discussionPreferencesQuery, { name: 'discussionPreferences' }),
  graphql(setDiscussionPreferencesMutation, {
    props: ({ ownProps: { discussionId }, mutate }) => ({
      setDiscussionPreferences: (anonymity, credential, notifications) => {
        return mutate({
          variables: {
            discussionId,
            discussionPreferences: {
              anonymity,
              credential: credential && credential.trim() ? credential : null,
              notifications
            }
          },
          update: (proxy, { data: { setDiscussionPreferences } }) => {
            const variables = { discussionId }
            const data = proxy.readQuery({
              query: discussionPreferencesQuery,
              variables
            })
            proxy.writeQuery({
              query: discussionPreferencesQuery,
              variables,
              data: produce(data, draft => {
                draft.discussion.userPreference =
                  setDiscussionPreferences.userPreference
                draft.discussion.displayAuthor =
                  setDiscussionPreferences.displayAuthor
              })
            })
          }
        }).catch(toRejectedString)
      }
    })
  })
)
