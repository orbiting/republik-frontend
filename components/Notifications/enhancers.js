import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { documentFragment } from '../Feed/fragments'

const notificationInfo = gql`
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
  }
`

export const notificationsQuery = gql`
  query getNotifications($after: String) {
    me {
      id
      discussionNotificationChannels
    }
    notifications(first: 7, after: $after) {
      totalCount
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
            content
            text
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
              document {
                id
                meta {
                  title
                  path
                  template
                  ownDiscussion {
                    id
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
          body
          url
          icon
        }
        channels
        mailLogRecord {
          email
          id
          status
        }
      }
    }
  }
  ${documentFragment}
  ${subInfo}
`

export const mySubscriptions = gql`
  query mySubscriptions {
    me {
      id
      subscribedTo(objectType: Document) {
        nodes {
          ...subInfo
          object {
            __typename
            ... on Document {
              id
              meta {
                title
              }
            }
          }
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
  mutation cancelMembership($id: ID!) {
    markNotificationAsRead(id: $id) {
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

export const withMarkAsReadMutation = graphql(markAsReadMutation, {
  props: ({ mutate }) => ({
    markAsReadMutation: id => {
      return mutate({
        variables: {
          id
        }
      })
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

export const withUnsubFromDoc = graphql(unsubscribeFromDocumentMutation, {
  props: ({ mutate }) => ({
    unsubFromDoc: variables =>
      mutate({
        variables
      })
  })
})
