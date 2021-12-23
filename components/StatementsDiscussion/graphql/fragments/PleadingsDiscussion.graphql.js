import gql from 'graphql-tag'

const DISCUSSION_FRAGMENT = gql`
  fragment PleadingDiscussion on Discussion {
    id
    closed
    title
    path
    userPreference {
      anonymity
      credential {
        description
        verified
      }
      notifications
    }
    rules {
      maxLength
      minInterval
      anonymity
      disableTopLevelComments
    }
    userWaitUntil
    userCanComment
    displayAuthor {
      id
      name
      slug
      credential {
        description
        verified
      }
      profilePicture
    }
    collapsable
    tagRequired
    tags
  }
`

export default DISCUSSION_FRAGMENT
