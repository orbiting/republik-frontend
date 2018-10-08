import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'
import mkDebug from 'debug'
import { errorToString } from '../../lib/utils/errors'
import withT from '../../lib/withT'
import withAuthorization from '../Auth/withAuthorization'

import { DISCUSSION_POLL_INTERVAL_MS, APP_OPTIONS } from '../../lib/constants'

const debug = mkDebug('discussion')

export const DISCUSSION_NOTIFICATION_CHANNELS = [
  'EMAIL',
  APP_OPTIONS && 'APP',
  'WEB'
].filter(Boolean)

export const DISCUSSION_NOTIFICATION_OPTIONS = [
  'MY_CHILDREN',
  'ALL',
  'NONE'
]

// Convert the Error object into a string, but keep the Promise rejected.
const toRejectedString = e => Promise.reject(errorToString(e))

export const countNode = comment =>
  1 + (!comment.comments ? 0 : comment.comments.totalCount)

export const countNodes = nodes =>
  !nodes ? 0 : nodes.reduce((a, comment) => a + countNode(comment), 0)

// The empty??? constructors are functions which create empty objects
// matching the corresponding GraphQL types. They are functions instead
// of simple 'const's because we modify the objects in-place in the
// code below.
const emptyPageInfo = () => ({
  __typename: 'PageInfo',
  hasNextPage: false,
  endCursor: null
})

// This function extends the props with the 'DisplayUser' that will be used
// when the current user submits a new comment in the given discussion
// (specified by its discussionId in the ownProps). The shape of the 'DisplayUser'
// is determined based on the discussion rules, and the users' preferences.
//
// The prop is called 'discussionDisplayAuthor'.
export const withDiscussionDisplayAuthor = graphql(gql`
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
`, {
  props: ({ ownProps: { t }, data: { discussion } }) => {
    debug('discussionDisplayAuthor', discussion)
    if (!discussion) {
      return {}
    }

    return {
      discussionClosed: discussion.closed,
      discussionUserCanComment: discussion.userCanComment,
      discussionDisplayAuthor: discussion.displayAuthor
    }
  }
})

export const fragments = {
  comment: gql`
    fragment Comment on Comment {
      id
      text
      content
      published
      adminUnpublished
      score
      userVote
      userCanEdit
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
      updatedAt
      createdAt
      parentIds
    }
  `,
  connectionInfo: gql`
    fragment ConnectionInfo on CommentConnection {
      id
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `
}

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

// Find the comment with the given ID and invoke the callback with it as
// the first argument.
const modifyComment = (comment, id, onComment) => {
  if (comment.id === id) {
    onComment(comment)
  } else if (comment.comments && comment.comments.nodes) {
    comment.comments.nodes.forEach(child => {
      modifyComment(child, id, onComment)
    })
  }
}

export const upvoteComment = graphql(gql`
mutation discussionUpvoteComment($commentId: ID!) {
  upvoteComment(id: $commentId) {
    ...Comment
  }
}
${fragments.comment}
`, {
  props: ({ mutate }) => ({
    upvoteComment: (commentId) => {
      return mutate({ variables: { commentId } }).catch(toRejectedString)
    }
  })
})

export const downvoteComment = graphql(gql`
mutation discussionDownvoteComment($commentId: ID!) {
  downvoteComment(id: $commentId) {
    ...Comment
  }
}
${fragments.comment}
`, {
  props: ({ mutate }) => ({
    downvoteComment: (commentId) => {
      return mutate({ variables: { commentId } }).catch(toRejectedString)
    }
  })
})

export const isAdmin = withAuthorization(['admin', 'editor'], 'isAdmin')

export const unpublishComment = graphql(gql`
mutation discussionUnpublishComment($commentId: ID!) {
  unpublishComment(id: $commentId) {
    ...Comment
  }
}
${fragments.comment}
`, {
  props: ({ mutate }) => ({
    unpublishComment: (commentId) => {
      return mutate({ variables: { commentId } }).catch(toRejectedString)
    }
  })
})

const optimisticContent = text => ({
  content: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: text }
        ]
      }
    ]
  },
  text
})

export const editComment = graphql(gql`
mutation discussionEditComment($commentId: ID!, $content: String!) {
  editComment(id: $commentId, content: $content) {
    ...Comment
  }
}
${fragments.comment}
`, {
  props: ({ mutate }) => ({
    editComment: (comment, content) => {
      return mutate({
        variables: { commentId: comment.id, content },
        optimisticResponse: {
          __typename: 'Mutation',
          submitComment: {
            ...comment,
            ...optimisticContent(content)
          }
        }
      }).catch(toRejectedString)
    }
  })
})

export const query = gql`
query discussion($discussionId: ID!, $parentId: ID, $after: String, $orderBy: DiscussionOrder!, $depth: Int!, $focusId: ID) {
  me {
    id
    name
    portrait
  }
  discussion(id: $discussionId) {
    id
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
    }
    userWaitUntil
    documentPath
    comments(parentId: $parentId, after: $after, orderBy: $orderBy, first: 100, flatDepth: $depth, focusId: $focusId) {
      totalCount
      directTotalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      focus {
        id
        parentIds
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

export const submitComment = compose(
  withT,
  withDiscussionDisplayAuthor,
  graphql(gql`
mutation discussionSubmitComment($discussionId: ID!, $parentId: ID, $id: ID!, $content: String!) {
  submitComment(id: $id, discussionId: $discussionId, parentId: $parentId, content: $content) {
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
`, {
    props: ({ ownProps: { t, discussionId, parentId: ownParentId, orderBy, depth, focusId, discussionDisplayAuthor }, mutate }) => ({
      submitComment: (parent, content) => {
        if (!discussionDisplayAuthor) {
          return Promise.reject(t('submitComment/noDisplayAuthor'))
        }
        // Generate a new UUID for the comment. We do this client-side so that we can
        // properly handle subscription notifications.
        const id = uuid()

        const parentId = parent ? parent.id : null
        const parentIds = parent
          ? parent.parentIds.concat(parentId)
          : []

        return mutate({
          variables: { discussionId, parentId, id, content },
          optimisticResponse: {
            __typename: 'Mutation',
            submitComment: {
              id,
              ...optimisticContent(content),
              published: true,
              adminUnpublished: false,
              userCanEdit: true,
              score: 0,
              userVote: null,
              displayAuthor: discussionDisplayAuthor,
              createdAt: (new Date()).toISOString(),
              updatedAt: (new Date()).toISOString(),
              parentIds,
              __typename: 'Comment'
            }
          },
          update: (proxy, { data: { submitComment } }) => {
            debug('submitComment', submitComment.id, submitComment)
            const variables = {
              discussionId,
              parentId: ownParentId,
              after: null,
              orderBy,
              depth,
              focusId
            }
            const data = proxy.readQuery({
              query: query,
              variables
            })

            const existing = data.discussion.comments.nodes.find(n => n.id === submitComment.id)
            // subscriptions seem to make optimistic updates permanent
            if (existing) {
              debug('submitComment', 'existing', existing)
              return
            }

            const comment = {
              ...submitComment,
              comments: {
                __typename: 'CommentConnection',
                totalCount: 0,
                directTotalCount: 0,
                pageInfo: emptyPageInfo()
              }
            }

            const nodes = [].concat(data.discussion.comments.nodes)

            const parentIndex = parentId && nodes.findIndex(n => n.id === parentId)
            const insertIndex = parentId
              ? parentIndex + 1
              : 0
            nodes.splice(insertIndex, 0, comment)

            submitComment.parentIds.forEach(pid => {
              const pidIndex = parentId && nodes.findIndex(n => n.id === pid)

              if (pidIndex === -1) {
                return
              }
              const node = nodes[pidIndex]
              nodes.splice(pidIndex, 1, {
                ...node,
                comments: {
                  ...node.comments,
                  totalCount: node.comments.totalCount + 1,
                  directTotalCount: node.comments.directTotalCount +
                  pidIndex === parentIndex ? 1 : 0
                }
              })
            })

            proxy.writeQuery({
              query: query,
              variables,
              data: {
                ...data,
                discussion: {
                  ...data.discussion,
                  comments: {
                    ...data.discussion.comments,
                    totalCount: data.discussion.comments.totalCount +
                    1,
                    nodes
                  }
                }
              }
            })
          }
        }).catch(toRejectedString)
      }
    })
  })
)

const discussionPreferencesQuery = gql`
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
  }
}
`
export const withDiscussionPreferences = graphql(discussionPreferencesQuery)

export const withSetDiscussionPreferences = graphql(gql`
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
`, {
  props: ({ ownProps: { discussionId }, mutate }) => ({
    setDiscussionPreferences: (anonymity, credential, notifications) => {
      return mutate({
        variables: {
          discussionId,
          discussionPreferences: {
            anonymity,
            credential,
            notifications
          }
        },
        update: (proxy, { data: { setDiscussionPreferences } }) => {
          const immutableData = proxy.readQuery({
            query: discussionPreferencesQuery,
            variables: { discussionId }
          })

          // clone() the data object so that we can mutate it in-place.
          const data = JSON.parse(JSON.stringify(immutableData))
          data.discussion.userPreference = setDiscussionPreferences.userPreference
          data.discussion.displayAuthor = setDiscussionPreferences.displayAuthor

          proxy.writeQuery({
            query: discussionPreferencesQuery,
            variables: { discussionId },
            data
          })
        }
      }).catch(toRejectedString)
    }
  })
})

export const withUpdateNotificationSettings = graphql(gql`
mutation updateNotificationSettings(
  $defaultDiscussionNotificationOption: DiscussionNotificationOption,
  $discussionNotificationChannels: [DiscussionNotificationChannel!]
) {
  updateNotificationSettings(
    defaultDiscussionNotificationOption: $defaultDiscussionNotificationOption,
    discussionNotificationChannels: $discussionNotificationChannels
  ) {
    id
    discussionNotificationChannels
    defaultDiscussionNotificationOption
  }
}
`, {
  props: ({ mutate }) => ({
    updateNotificationSettings: ({ defaultDiscussionNotificationOption, discussionNotificationChannels }) =>
      mutate({
        variables: {
          defaultDiscussionNotificationOption,
          discussionNotificationChannels
        }
      })
  })
})

// const countSubscription = gql`
// subscription discussionComments($discussionId: ID!) {
//   comment(discussionId: $discussionId) {
//     mutation
//     node {
//       id
//     }
//   }
// }
// `

const countQuery = gql`
query discussion($discussionId: ID!) {
  discussion(id: $discussionId) {
    id
    comments(first: 0) {
      totalCount
    }
  }
}
`

export const withCount = graphql(countQuery, {
  options: {
    pollInterval: DISCUSSION_POLL_INTERVAL_MS
  },
  props: ({ ownProps: { discussionId, shouldUpdate }, data: { discussion, subscribeToMore } }) => ({
    count: discussion && discussion.comments && discussion.comments.totalCount,
    subscribe: () => {
      // fall back to polling for now
      return () => {}

      // return subscribeToMore({
      //   document: countSubscription,
      //   variables: {
      //     discussionId
      //   },
      //   onError (...args) {
      //     debug('count:onError', args)
      //   },
      //   updateQuery: (previousResult, { subscriptionData }) => {
      //     const { node: comment, mutation } = subscriptionData.data.comment

      //     debug('count:updateQuery', mutation, comment, {shouldUpdate})
      //     if (mutation !== 'CREATED') {
      //       return previousResult
      //     }
      //     debug('count:inc', mutation, comment)

      //     return {
      //       ...previousResult,
      //       discussion: {
      //         ...previousResult.discussion,
      //         comments: {
      //           ...previousResult.discussion.comments,
      //           totalCount: previousResult.discussion.comments.totalCount + 1
      //         }
      //       }
      //     }
      //   }
      // })
    }
  })
})
