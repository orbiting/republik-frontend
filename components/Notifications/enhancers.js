import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { documentFragment } from '../Feed/fragments'

export const notificationInfo = gql`
  fragment notificationInfo on Notification {
    id
    readAt
    createdAt
  }
`

export const subInfo = gql`
  fragment subInfo on Subscription {
    id
    active
    filters
    object {
      ... on User {
        id
        name
      }
      ... on Document {
        id
        meta {
          title
        }
      }
    }
  }
`

export const notificationsMiniQuery = gql`
  query getNotificationsMini {
    notifications(first: 3) {
      nodes {
        id
        readAt
        createdAt
        object {
          __typename
          ... on Comment {
            id
            published
          }
          ... on Document {
            id
          }
        }
        content {
          title
          url
        }
      }
    }
  }
`

export const notificationsQuery = gql`
  query getNotifications($after: String) {
    me {
      id
      discussionNotificationChannels
    }
    notifications(first: 10, after: $after) {
      totalCount
      unreadCount
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      nodes {
        id
        readAt
        createdAt
        object {
          ... on Document {
            ...FeedDocument
          }
          ... on Comment {
            id
            preview(length: 120) {
              string
              more
            }
            createdAt
            displayAuthor {
              id
              name
              slug
              profilePicture
              credential {
                description
                verified
              }
            }
            published
            updatedAt
            tags
            parentIds
            discussion {
              id
              title
              path
              isBoard
              document {
                id
                meta {
                  title
                  path
                  credits
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
            }
          }
          __typename
        }
        subscription {
          ...subInfo
        }
        content {
          title
          url
        }
        channels
      }
    }
  }
  ${documentFragment}
  ${subInfo}
`

export const possibleSubscriptions = gql`
  query getSubscriptions {
    sections: documents(template: "section") {
      nodes {
        id
        repoId
        meta {
          title
        }
        formats: linkedDocuments(feed: true) {
          nodes {
            id
            subscribedByMe {
              ...subInfo
            }
          }
        }
      }
    }
  }
  ${subInfo}
`

export const possibleAuthorSubscriptions = gql`
  query getPossibleAuthorSubscriptions {
    authors: employees(onlyPromotedAuthors: true) {
      name
      user {
        id
        subscribedByMe {
          ...subInfo
        }
      }
    }
  }
  ${subInfo}
`

export const userSubscriptions = gql`
  query getUserSubscriptions {
    myUserSubscriptions: me {
      id
      subscribedTo(objectType: User) {
        nodes {
          ...subInfo
        }
      }
    }
  }
  ${subInfo}
`

const notificationCountQuery = gql`
  query getNotificationCount {
    notifications {
      nodes {
        ...notificationInfo
      }
    }
  }
  ${notificationInfo}
`

const markAsReadMutation = gql`
  mutation markNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      ...notificationInfo
    }
  }
  ${notificationInfo}
`

const markAllAsReadMutation = gql`
  mutation markAllNotificationsAsRead {
    markAllNotificationsAsRead {
      ...notificationInfo
    }
  }
  ${notificationInfo}
`

const subscribeToDocumentMutation = gql`
  mutation subToDoc($documentId: ID!) {
    subscribe(objectId: $documentId, type: Document) {
      ...subInfo
    }
  }
  ${subInfo}
`
const unsubscribeFromDocumentMutation = gql`
  mutation unsubscribe($subscriptionId: ID!) {
    unsubscribe(subscriptionId: $subscriptionId) {
      ...subInfo
    }
  }
  ${subInfo}
`
const subscribeToUserMutation = gql`
  mutation subToUser($userId: ID!, $filters: [EventObjectType!]) {
    subscribe(objectId: $userId, type: User, filters: $filters) {
      ...subInfo
    }
  }
  ${subInfo}
`

const unsubscribeFromUserMutation = gql`
  mutation unSubFromUser($subscriptionId: ID!, $filters: [EventObjectType!]) {
    unsubscribe(subscriptionId: $subscriptionId, filters: $filters) {
      ...subInfo
    }
  }
  ${subInfo}
`

export const notificationSubscription = gql`
  subscription {
    notification {
      ...notificationInfo
    }
  }
  ${notificationInfo}
`

export const withNotificationCount = graphql(notificationCountQuery, {
  name: 'countData'
})

const alreadyMarkedAsReadIds = []
export const withMarkAsReadMutation = graphql(markAsReadMutation, {
  props: ({ mutate }) => ({
    markAsReadMutation: id => {
      if (alreadyMarkedAsReadIds.includes(id)) {
        return Promise.resolve()
      }
      alreadyMarkedAsReadIds.push(id)
      return mutate({
        variables: {
          id
        }
      })
    }
  })
})

export const withMarkAllAsReadMutation = graphql(markAllAsReadMutation, {
  props: ({ mutate }) => ({
    markAllAsReadMutation: () => {
      return mutate()
    }
  })
})

export const withSubToDoc = graphql(subscribeToDocumentMutation, {
  props: ({ mutate }) => ({
    subToDoc: variables =>
      mutate({
        variables
      })
  })
})

export const withSubToUser = graphql(subscribeToUserMutation, {
  props: ({ mutate }) => ({
    subToUser: variables =>
      mutate({
        variables
      })
  })
})

export const withUnsubFromUser = graphql(unsubscribeFromUserMutation, {
  props: ({ mutate }) => ({
    unsubFromUser: variables =>
      mutate({
        variables
      })
  })
})

export const withUnsubFromDoc = graphql(unsubscribeFromDocumentMutation, {
  props: ({ mutate }) => ({
    unsubFromDoc: variables =>
      mutate({
        variables
      })
  })
})
