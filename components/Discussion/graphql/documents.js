/**
 * This JavaScript module exports all GraphQL documents (queries, mutations,
 * subscription) which are used throughout the Discussion components.
 *
 * Most of these documents are used from the enhancers (see ./enhancers/*). Though
 * they can be imported and used elsewhere, too.
 *
 * Fragments that are used by these documents are stored in a separate file.
 */

import gql from 'graphql-tag'
import * as fragments from './fragments'

/*
 * QUERIES
 */

export const discussionCommentsCountQuery = gql`
  query discussionCommentsCount($discussionId: ID!) {
    discussion(id: $discussionId) {
      ...Discussion
      comments(first: 0) {
        totalCount
      }
    }
  }
  ${fragments.discussion}
`
export const discussionDisplayAuthorQuery = gql`
  query discussionDisplayAuthor($discussionId: ID!) {
    discussion(id: $discussionId) {
      ...Discussion
    }
  }
  ${fragments.discussion}
`

export const discussionPublishedAtQuery = gql`
  query discussionDisplayAuthor($discussionId: ID!) {
    discussion(id: $discussionId) {
      id
      document {
        id
        meta {
          publishDate
        }
      }
    }
  }
`

export const discussionPreferencesQuery = gql`
  query discussionPreferences($discussionId: ID!) {
    me {
      id
      credentials {
        description
        verified
        isListed
      }
      defaultDiscussionNotificationOption
      discussionNotificationChannels
    }
    discussion(id: $discussionId) {
      ...Discussion
    }
  }
  ${fragments.discussion}
`

export const discussionQuery = gql`
  query discussion(
    $discussionId: ID!
    $parentId: ID
    $after: String
    $orderBy: DiscussionOrder!
    $depth: Int!
    $focusId: ID
    $includeParent: Boolean
  ) {
    me {
      id
      name
      portrait
    }
    discussion(id: $discussionId) {
      ...Discussion
      comments(
        parentId: $parentId
        after: $after
        orderBy: $orderBy
        first: 100
        flatDepth: $depth
        focusId: $focusId
        includeParent: $includeParent
      ) {
        totalCount
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

export const commentPreviewQuery = gql`
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

/*
 * MUTATIONS
 */

export const submitCommentMutation = gql`
  mutation submitComment(
    $discussionId: ID!
    $parentId: ID
    $id: ID!
    $content: String!
    $tags: [String!]!
  ) {
    submitComment(
      id: $id
      discussionId: $discussionId
      parentId: $parentId
      content: $content
      tags: $tags
    ) {
      ...Comment
      discussion {
        id
        userPreference {
          notifications
        }
        userWaitUntil
      }
    }
  }
  ${fragments.comment}
`

export const upvoteCommentMutation = gql`
  mutation upvoteCommentMutation($commentId: ID!) {
    upvoteComment(id: $commentId) {
      ...Comment
    }
  }
  ${fragments.comment}
`

export const reportCommentMutation = gql`
  mutation reportCommentMutation($commentId: ID!) {
    reportComment(id: $commentId) {
      ...Comment
    }
  }
  ${fragments.comment}
`

export const featureCommentMutation = gql`
  mutation featureCommentMutation(
    $commentId: ID!
    $content: String
    $targets: [CommentFeaturedTarget!]
  ) {
    featureComment(id: $commentId, content: $content, targets: $targets) {
      ...Comment
    }
  }
  ${fragments.comment}
`

export const downvoteCommentMutation = gql`
  mutation downvoteComment($commentId: ID!) {
    downvoteComment(id: $commentId) {
      ...Comment
    }
  }
  ${fragments.comment}
`

export const unvoteCommentMutation = gql`
  mutation unvoteComment($commentId: ID!) {
    unvoteComment(id: $commentId) {
      ...Comment
    }
  }
  ${fragments.comment}
`

export const editCommentMutation = gql`
  mutation editComment($commentId: ID!, $content: String!, $tags: [String!]) {
    editComment(id: $commentId, content: $content, tags: $tags) {
      ...Comment
    }
  }
  ${fragments.comment}
`

export const unpublishCommentMutation = gql`
  mutation unpublishComment($commentId: ID!) {
    unpublishComment(id: $commentId) {
      ...Comment
    }
  }
  ${fragments.comment}
`

export const updateNotificationSettingsMutation = gql`
  mutation updateNotificationSettings(
    $defaultDiscussionNotificationOption: DiscussionNotificationOption
    $discussionNotificationChannels: [DiscussionNotificationChannel!]
  ) {
    updateNotificationSettings(
      defaultDiscussionNotificationOption: $defaultDiscussionNotificationOption
      discussionNotificationChannels: $discussionNotificationChannels
    ) {
      id
      discussionNotificationChannels
      defaultDiscussionNotificationOption
    }
  }
`

export const setDiscussionPreferencesMutation = gql`
  mutation setDiscussionPreferences(
    $discussionId: ID!
    $discussionPreferences: DiscussionPreferencesInput!
  ) {
    setDiscussionPreferences(
      id: $discussionId
      discussionPreferences: $discussionPreferences
    ) {
      ...Discussion
    }
  }
  ${fragments.discussion}
`

/*
 * SUBSCRIPTIONS
 */

export const webNotificationSubscription = gql`
  subscription {
    webNotification {
      title
      body
      icon
      url
      tag
    }
  }
`

export const commentsSubscription = gql`
  subscription discussionComments($discussionId: ID!) {
    comment(discussionId: $discussionId) {
      mutation
      node {
        ...Comment
      }
    }
  }
  ${fragments.comment}
`
