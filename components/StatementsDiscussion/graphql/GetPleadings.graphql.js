import gql from 'graphql-tag'
import DISCUSSION_FRAGMENT from './fragments/PleadingsDiscussion.graphql'
import COMMENT_FRAGMENT from './fragments/PleadingComment.graphql'

const GET_PLEADINGS_QUERY = gql`
  query getPleadingDiscussion(
    $discussionId: ID!
    $first: Int!
    $orderBy: DiscussionOrder!
  ) {
    discussion(id: $discussionId) {
      ...PleadingDiscussion
      comments(first: $first, orderBy: $orderBy) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          ...PleadingComment
        }
      }
    }
  }
  ${DISCUSSION_FRAGMENT}
  ${COMMENT_FRAGMENT}
`

export default GET_PLEADINGS_QUERY
