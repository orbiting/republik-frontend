import { gql } from '@apollo/client'

export const DISCUSSION_FRAGMENT = gql`
  fragment Discussion on Discussion {
    id
    closed
    title
    path
    isBoard
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
    document {
      id
      meta {
        path
        twitterImage
        template
        publishDate
        ownDiscussion {
          id
          closed
        }
        linkedDiscussion {
          id
          path
          closed
        }
      }
    }
    collapsable
    tagRequired
    tags
    tagBuckets {
      value
      count
    }
  }
`
