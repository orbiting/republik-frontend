import { gql } from '@apollo/client'
import { CommentFragmentType } from '../fragments/CommentFragment.graphql'
import Nullable from '../../../../lib/types/Nullable'
import { makeQueryHook } from '../../../../lib/helpers/AbstractApolloGQLHooks.helper'

export type PreviewCommentQueryVariables = {
  discussionId: string
  content: string
  parentId: string
  id: string
}

export type PreviewCommentQuery = {
  commentPreview: Pick<CommentFragmentType, 'id' | 'content' | 'embed'> & {
    contentLength: Nullable<number>
  }
}

export const PREVIEW_COMMENT_QUERY = gql`
  query commentPreview(
    $discussionId: ID!
    $content: String!
    $parentId: ID
    $id: ID
  ) {
    commentPreview(
      content: $content
      discussionId: $discussionId
      parentId: $parentId
      id: $id
    ) {
      id
      content
      contentLength
      embed {
        ... on LinkPreview {
          url
          title
          description
          imageUrl
          imageAlt
          siteName
          siteImageUrl
          updatedAt
          __typename
        }
        ... on TwitterEmbed {
          id
          url
          text
          html
          userName
          userScreenName
          userProfileImageUrl
          image
          createdAt
          __typename
        }
      }
    }
  }
`

const usePreviewCommentQuery = makeQueryHook<
  PreviewCommentQuery,
  PreviewCommentQueryVariables
>(PREVIEW_COMMENT_QUERY)

export default usePreviewCommentQuery
