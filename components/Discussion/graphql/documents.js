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
      id
      comments(first: 0) {
        totalCount
      }
    }
  }
`
export const discussionDisplayAuthorQuery = gql`
  query discussionDisplayAuthor($discussionId: ID!) {
    discussion(id: $discussionId) {
      id
      closed
      userCanComment
      userWaitUntil
      displayAuthor {
        id
        name
        username
        credential {
          description
          verified
        }
        profilePicture
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
      id
      rules {
        maxLength
        minInterval
        anonymity
        disableTopLevelComments
      }
      userWaitUntil
      userPreference {
        anonymity
        credential {
          description
          verified
        }
        notifications
      }
      tagRequired
      tags
    }
  }
`

export const discussionQuery = gql`
  query discussion(
    $discussionId: ID!
    $parentId: ID
    $after: String
    $orderBy: DiscussionOrder!
    $depth: Int!
    $focusId: ID
  ) {
    me {
      id
      name
      portrait
    }
    discussion(id: $discussionId) {
      id
      closed
      title
      path
      userPreference {
        anonymity
        credential {
          description
          verified
        }
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
        username
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
      comments(
        parentId: $parentId
        after: $after
        orderBy: $orderBy
        first: 100
        flatDepth: $depth
        focusId: $focusId
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
  ${fragments.comment}
`

/*
 * MUTATIONS
 */

export const submitCommentMutation = gql`
  mutation submitComment($discussionId: ID!, $parentId: ID, $id: ID!, $content: String!, $tags: [String!]!) {
    submitComment(id: $id, discussionId: $discussionId, parentId: $parentId, content: $content, tags: $tags) {
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
  mutation setDiscussionPreferences($discussionId: ID!, $discussionPreferences: DiscussionPreferencesInput!) {
    setDiscussionPreferences(id: $discussionId, discussionPreferences: $discussionPreferences) {
      id
      userPreference {
        anonymity
        credential {
          description
          verified
        }
        notifications
      }
      displayAuthor {
        id
        name
        username
        credential {
          description
          verified
        }
        profilePicture
      }
    }
  }
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
