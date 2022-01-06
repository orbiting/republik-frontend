import { gql } from '@apollo/client'
import { notificationInfo } from '../../Notifications/enhancers'

export const COMMENT_FRAGMENT = gql`
  fragment Comment on Comment {
    id
    text
    content
    published
    adminUnpublished
    featuredAt
    featuredText
    featuredTargets
    downVotes
    upVotes
    userVote
    userCanEdit
    userCanReport
    userReportedAt
    numReports
    displayAuthor {
      id
      name
      slug
      credential {
        description
        verified
      }
      profilePicture
    }
    unreadNotifications {
      nodes {
        ...notificationInfo
      }
    }
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
    updatedAt
    createdAt
    parentIds
    tags
    mentioningDocument {
      iconUrl
      document {
        id
        meta {
          path
        }
      }
      fragmentId
    }
  }
  ${notificationInfo}
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
