import gql from 'graphql-tag'
import COMMENT_FRAGMENT from './fragments/PleadingComment.graphql'

const CREATE_PLEADING_MUTATION = gql`
  mutation submitComment(
    $discussionId: ID!
    $content: String!
    $tags: [String!]!
  ) {
    submitComment(discussionId: $discussionId, content: $content, tags: $tags) {
      ...PleadingComment
      discussion {
        id
        userPreference {
          notifications
        }
        userWaitUntil
      }
    }
  }
  ${COMMENT_FRAGMENT}
`

export default CREATE_PLEADING_MUTATION
