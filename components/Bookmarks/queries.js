import { BOOKMARKS_COLLECTION_NAME } from './fragments'
import gql from 'graphql-tag'
import { documentFragment } from '../Feed/fragments'

export const getBookmarkedDocuments = gql`
  query getBookmarkedDocuments($cursor: String) {
    me {
      id
      collection(name: "${BOOKMARKS_COLLECTION_NAME}") {
        id
        items(first: 50, after: $cursor) {
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
  }
  ${documentFragment}
`
