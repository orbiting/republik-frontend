import { gql } from '@apollo/client'
import Nullable from '../../../../../lib/types/Nullable'
import {
  DiscussionNotificationChannel,
  DiscussionNotificationOption
} from '../types/SharedTypes'
import {
  DISCUSSION_FRAGMENT,
  DiscussionFragmentType
} from '../fragments/DiscussionFragment.graphql'

export type DiscussionPreferencesQueryVariables = {
  discussionId: string
}

export type DiscussionPreferencesQueryResult = {
  me: {
    id: string
    name: Nullable<string>
    portrait: Nullable<string>
    credentials: {
      description: string
      verified: string
      isListed: string
    }[]
    defaultDiscussionNotificationOption: DiscussionNotificationOption
    discussionNotificationChannels: DiscussionNotificationChannel[]
  }
  discussion: DiscussionFragmentType
}

export const DISCUSSION_PREFERENCES_QUERY = gql`
  query discussionPreferences($discussionId: ID!) {
    me {
      id
      name
      portrait
      credentials {
        description
        verified
        isListed
      }
      defaultDiscussionNotificationOption
      discussionNotificationChannels
    }
    discussion(id: $discussionId) {
      ...Discussion
    }
  }
  ${DISCUSSION_FRAGMENT}
`
