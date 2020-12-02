import gql from 'graphql-tag'
import { notificationInfo } from '../../Notifications/enhancers'

export const discussion = gql`
  fragment Discussion on Discussion {
    id
    closed
    title
    path
    isBoard
    userPreference {
      anonymity
      credential {
        description
        verified
      }
      notifications
    }
    rules {
      maxLength
      minInterval
      anonymity
      disableTopLevelComments
    }
    userWaitUntil
    userCanComment
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
    document {
      id
      meta {
        path
        twitterImage
        template
        ownDiscussion {
          id
          closed
        }
        linkedDiscussion {
          id
          path
          closed
        }
      }
    }
    collapsable
    tagRequired
    tags
  }
`

export const comment = gql`
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
