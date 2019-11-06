import { graphql } from 'react-apollo'

import { updateNotificationSettingsMutation } from '../documents'

/**
 * Provides the component with
 *
 *   {
 *     updateNotificationSettings({ … })
 *   }
 */

export const withUpdateNotificationSettings = graphql(
  updateNotificationSettingsMutation,
  {
    props: ({ mutate }) => ({
      updateNotificationSettings: ({
        discussionNotificationChannels,
        defaultDiscussionNotificationOption
      }) =>
        mutate({
          variables: {
            discussionNotificationChannels,
            defaultDiscussionNotificationOption
          }
        })
    })
  }
)
