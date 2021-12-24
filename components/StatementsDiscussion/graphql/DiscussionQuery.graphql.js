import { gql } from '@apollo/client'
import * as fragments from '../../Discussion/graphql/fragments'

export const ENHANCED_DISCUSSION_QUERY = gql`
  query discussion(
    $discussionId: ID!
    $parentId: ID
    $after: String
    $orderBy: DiscussionOrder!
    $depth: Int!
    $focusId: ID
    $includeParent: Boolean
    $activeTag: String
    $first: Int!
  ) {
    me {
      id
      name
      portrait
    }
    discussion(id: $discussionId) {
      ...Discussion
      allComments: comments(
        parentId: $parentId
        after: $after
        orderBy: $orderBy
        first: $first
        flatDepth: $depth
        focusId: $focusId
        includeParent: $includeParent
      ) {
        totalCount
      }
      comments(
        parentId: $parentId
        after: $after
        orderBy: $orderBy
        first: $first
        flatDepth: $depth
        focusId: $focusId
        includeParent: $includeParent
        tag: $activeTag
      ) {
        totalCount
        resolvedOrderBy
        directTotalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        focus {
          id
          parentIds
          preview(length: 300) {
            string
          }
          displayAuthor {
            id
            name
          }
        }
        nodes {
          ...Comment
          comments {
            totalCount
            directTotalCount
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
  }
  ${fragments.discussion}
  ${fragments.comment}
`
