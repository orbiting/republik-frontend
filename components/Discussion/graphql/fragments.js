import gql from 'graphql-tag'

export const discussion = gql`
  fragment Discussion on Discussion {
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
      username
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
        template
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
  }
`

export const comment = gql`
  fragment Comment on Comment {
    id
    text
    content
    published
    adminUnpublished
    downVotes
    upVotes
    userVote
    userCanEdit
    displayAuthor {
      id
      name
      username
      credential {
        description
        verified
      }
      profilePicture
    }
    updatedAt
    createdAt
    parentIds
    tags
  }
`

export const connectionInfo = gql`
  fragment ConnectionInfo on CommentConnection {
    id
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
  }
`
