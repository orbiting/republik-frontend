import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export const userProgressConsentFragment = `
  fragment ProgressConsent on User {
    progressConsent: hasConsentedTo(name: "PROGRESS")
  }
`

export const meQuery = gql`
  query me {
    me {
      id
      username
      portrait
      name
      firstName
      lastName
      email
      initials
      roles
      isListed
      hasPublicProfile
      discussionNotificationChannels
      accessCampaigns {
        id
      }
      prolongBeforeDate
      activeMembership {
        id
        type {
          name
        }
        endDate
      }
      ...ProgressConsent
    }
  }
  ${userProgressConsentFragment}
`

export default graphql(meQuery, {
  props: ({ data }) => ({
    me: data.me,
    meRefetch: data.refetch
  })
})
