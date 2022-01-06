import { gql } from '@apollo/client'
import * as fragments from '../../graphql/fragments'
import { DISCUSSION_FRAGMENT } from './DiscussionFragment.graphql'

// Todo: Type Discussion object
export type DiscussionObject = any

// Data returned by the discussion query
export type DiscussionQueryData = {
  // TODO: Type the discussion object!
  discussion: DiscussionObject
}

// Variables for the discussion query
export type DiscussionQueryVariables = {
  discussionId: string
  parentId?: string
  after?: string
  orderBy: string
  depth: number
  focusId?: string
  includeParent?: boolean
  activeTag?: string
}

export const DISCUSSION_QUERY = gql`
  query discussion(
    $discussionId: ID!
    $parentId: ID
    $after: String
    $orderBy: DiscussionOrder!
    $depth: Int!
    $focusId: ID
    $includeParent: Boolean
    $activeTag: String
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
        first: 100
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
        first: 100
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
  ${DISCUSSION_FRAGMENT}
  ${fragments.comment}
`
