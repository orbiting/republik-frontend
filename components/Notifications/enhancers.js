import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const notification = gql`
  fragment Notification on Notification {
    id
    readAt
    createdAt
  }
`

export const notificationsQuery = gql`
  query getNotifications($after: String) {
    notifications(first: 7, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      nodes {
        ...Notification
        object {
          ... on Document {
            id
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
  ${notification}
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

export const notificationSubscription = gql`
  subscription {
    notification {
      ...Notification
    }
  }
  ${notification}
`

export const withNotificationCount = graphql(notificationCountQuery)

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
