import gql from 'graphql-tag'

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
