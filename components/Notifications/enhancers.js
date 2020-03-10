import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { documentFragment } from '../Feed/fragments'

const notification = gql`
  fragment Notification on Notification {
    id
    readAt
    createdAt
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
          id
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
`

const notificationCountQuery = gql`
  query getNotificationCount {
    notifications {
      nodes {
        ...Notification
      }
    }
  }
  ${notification}
`

const markAsReadMutation = gql`
  mutation cancelMembership($id: ID!) {
    markNotificationAsRead(id: $id) {
      ...Notification
    }
  }
  ${notification}
`

const subscribeToDocumentMutation = gql`
  mutation subToDoc($documentId: ID!) {
    subscribe(objectId: $documentId, type: Document) {
      id
    }
  }
`
const unsubscribeFromDocumentMutation = gql`
  mutation unsubscribe($subscriptionId: ID!) {
    unsubscribe(subscriptionId: $subscriptionId) {
      id
    }
  }
`

export const notificationSubscription = gql`
  subscription {
    notification {
      ...Notification
    }
  }
  ${notification}
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
