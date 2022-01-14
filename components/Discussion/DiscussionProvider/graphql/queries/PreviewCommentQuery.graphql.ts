import { gql } from '@apollo/client'

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
