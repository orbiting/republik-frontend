import { gql } from '@apollo/client'
import * as fragments from '../../graphql/fragments'

export const DISCUSSION_PREFERENCES_QUERY = gql`
  query discussionPreferences($discussionId: ID!) {
    me {
      id
      name
      credentials {
        description
        verified
        isListed
      }
      defaultDiscussionNotificationOption
      discussionNotificationChannels
      portrait
    }
    discussion(id: $discussionId) {
      ...Discussion
    }
  }
  ${fragments.discussion}
`
