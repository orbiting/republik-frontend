import { graphql, compose } from 'react-apollo'
import { discussionPreferencesQuery, setDiscussionPreferencesMutation } from '../documents'
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
            const immutableData = proxy.readQuery({
              query: discussionPreferencesQuery,
              variables: { discussionId }
            })

            // clone() the data object so that we can mutate it in-place.
            const data = JSON.parse(JSON.stringify(immutableData))
            data.discussion.userPreference = setDiscussionPreferences.userPreference
            data.discussion.displayAuthor = setDiscussionPreferences.displayAuthor

            proxy.writeQuery({
              query: discussionPreferencesQuery,
              variables: { discussionId },
              data
            })
          }
        }).catch(toRejectedString)
      }
    })
  })
)
