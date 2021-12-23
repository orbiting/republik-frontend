import gql from 'graphql-tag'

const COMMENT_FRAGMENT = gql`
  fragment PleadingComment on Comment {
    id
    content
    tags
    published
    adminUnpublished
    downVotes
    upVotes
    userVote
    userCanEdit
    displayAuthor {
      username
      name
      profilePicture
    }
  }
`

export default COMMENT_FRAGMENT
