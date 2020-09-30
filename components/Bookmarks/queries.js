import gql from 'graphql-tag'
import { documentFragment } from '../Feed/fragments'

export const getBookmarkedDocuments = gql`
  query getBookmarkedDocuments(
    $cursor: String
    $collections: [String!]!
    $progress: ProgressState!
  ) {
    me {
      id
      collectionItems(
        names: $collections
        first: 50
        after: $cursor
        progress: $progress
      ) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          createdAt
          document {
            ...FeedDocument
          }
        }
      }
    }
  }
  ${documentFragment}
`
