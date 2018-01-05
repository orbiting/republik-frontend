import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'
import mkDebug from 'debug'
import { errorToString } from '../../lib/utils/errors'
import { dataIdFromObject } from '../../lib/apollo/initApollo'
const debug = mkDebug('discussion')

export const countNode = comment =>
  1 + (!comment.comments ? 0 : comment.comments.totalCount)

export const countNodes = nodes =>
  !nodes ? 0 : nodes.reduce((a, comment) => a + countNode(comment), 0)

// List of IDs (strings) of comments which the client has submitted but
// not received a response for yet. We need this so we can ignore the
// subscription event for those comments.
let pendingCommentIDs = []

// The empty??? constructors are functions which create empty objects
// matching the corresponding GraphQL types. They are functions instead
// of simple 'const's because we modify the objects in-place in the
// code below.
const emptyPageInfo = () => ({
  __typename: 'PageInfo',
  hasNextPage: false,
  endCursor: null
})

const emptyCommentConnection = comment => ({
  __typename: 'CommentConnection',
  id: comment.id,
  totalCount: 0,
  nodes: [],
  pageInfo: emptyPageInfo()
})

const myPreferences = gql`
query discussionPreference($discussionId: ID!) {
  discussion(id: $discussionId) {
    id
    userPreference {
      anonymity
      credential {
        description
        verified
      }
    }
  }
}
`
export const withMyPreferences = graphql(myPreferences)

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
    displayAuthor {
      id
      name
      credential {
        description
        verified
      }
      profilePicture
    }
  }
}
`, {
  props: ({ownProps: {t}, data: {discussion}}) => {
    debug('discussionDisplayAuthor', discussion)
    if (!discussion) {
      return {}
    }

    return {discussionDisplayAuthor: discussion.displayAuthor}
  }
})

const fragments = {
  comment: gql`
    fragment Comment on Comment {
      id
      content
      score
      userVote
      displayAuthor {
        profilePicture
        name
        credential {
          description
          verified
        }
      }
      updatedAt
      createdAt
    }
  `,
  // only the updatable parts
  subscriptionComment: gql`
    fragment SubscriptionComment on Comment {
      id
      content
      score
      userVote
      updatedAt
    }
  `,
  // local only
  // used for reading and updating totalCount and hasNextPage
  connectionCounts: gql`
    fragment ConnectionCounts on CommentConnection {
      id
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  `
}

export const commentsSubscription = gql`
subscription discussionComments($discussionId: ID!) {
  comment: comments(discussionId: $discussionId) {
    ...SubscriptionComment
    parentIds
  }
}
${fragments.subscriptionComment}
`

// The (logical) depth to which the query below fetches the discussion tree.
// This constant is exported because it's used in the 'DiscussionTreeRenderer'
// component to decide whether to use 'fetchMore' or whether to create a new
// connected component with its own root query.
export const maxLogicalDepth = 3

const rootQuery = gql`
query discussion($discussionId: ID!, $parentId: ID, $after: String, $orderBy: DiscussionOrder!) {
  me {
    id
    name
    portrait(size: SHARE)
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
    comments(parentId: $parentId, after: $after, orderBy: $orderBy, first: 5) @connection(key: "comments", filter: ["parentId", "orderBy"]) {
      ...ConnectionInfo

      # Depth 1
      nodes {
        ...Comment
        comments {
          ...ConnectionInfo

          # Depth 2
          nodes {
            ...Comment
            comments {
              ...ConnectionInfo

              # Depth 3
              nodes {
                ...Comment
                comments {
                  ...ConnectionInfo
                }
              }
            }
          }
        }
      }
    }
  }
}

fragment ConnectionInfo on CommentConnection {
  id
  totalCount
  pageInfo {
    hasNextPage
    endCursor
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

export const withData = compose(
withApollo,
graphql(rootQuery, {
  props: ({ownProps: {discussionId, orderBy, client, parentId}, data: {fetchMore, subscribeToMore, ...data}}) => ({
    data,
    fetchMore: (parentId, after) => {
      debug('fetchMore:init', {parentId, after})
      return fetchMore({
        variables: {discussionId, parentId, after, orderBy},
        updateQuery: (previousResult, {fetchMoreResult: {discussion}}) => {
          debug('fetchMore:updateQuery:response', {parentId, after, discussion})
          // previousResult is immutable. We clone the whole object, then recursively
          // iterate through the comments until we find the parent comment to which
          // to append the just fetched comments.

          // clone()
          const result = JSON.parse(JSON.stringify(previousResult))

          if (discussion && discussion.comments) {
            const {totalCount, pageInfo, nodes} = discussion.comments

            const insertNodes = (parent) => {
              if (!parent.comments) { parent.comments = {} }

              // When inserting the new nodes, filter out any comments which we
              // already have (which have been inserted through the `submitComment`
              // mutation or which have arrived through a subscription).
              const currentNodes = parent.comments.nodes || []
              const newNodes = nodes.filter(x => !currentNodes.some(y => y.id === x.id))

              parent.comments.totalCount = totalCount
              parent.comments.pageInfo = pageInfo
              parent.comments.nodes = [...currentNodes, ...newNodes]

              debug('fetchMore:updateQuery:insert', parent)
            }

            if (parentId) {
              modifyComment(result.discussion, parentId, insertNodes)
            } else {
              insertNodes(result.discussion)
            }
          }

          return result
        }
      })
    },
    subscribe: () => {
      // only root subscribes and updates cache fragments
      if (parentId) {
        // no-op unsubscribe
        return () => {}
      }
      debug('subscribe:init', {discussionId})
      const subscribtion = client.subscribe({
        query: commentsSubscription,
        variables: {discussionId}
      }).subscribe({
        next ({data, errors}) {
          if (errors) {
            debug('subscribe:event:errors', {discussionId, errors})
            return
          }
          const comment = data.comment
          // Ignore events for comments which were created by this client.
          if (pendingCommentIDs.indexOf(comment.id) !== -1) {
            return
          }
          debug('subscribe:event', {discussionId, comment})

          const readConnection = id =>
            client.readFragment({
              id: dataIdFromObject({
                __typename: 'CommentConnection',
                id: id
              }),
              fragment: fragments.connectionCounts
            })

          // ToDo: mutation type != CREATED
          const existingComment = !!readConnection(comment.id)
          if (existingComment) {
            // needed? maybe happens automatically by id
            debug('subscribe:event:update', {discussionId, comment})
            client.writeFragment({
              id: dataIdFromObject(comment),
              fragment: fragments.subscriptionComment,
              data: comment
            })
            return
          }

          const parentConnections = comment.parentIds
            .map(readConnection)
            .filter(Boolean)
          const isRoot = !comment.parentIds.length
          if (
            parentConnections.length || // known comment, rm once we have real parent ids array
            isRoot
          ) {
            parentConnections.unshift(readConnection(discussionId))
          }

          parentConnections.forEach((connection, index) => {
            const pageInfo = connection.pageInfo
            const data = {
              ...connection,
              totalCount: connection.totalCount + 1,
              pageInfo: {
                ...pageInfo,
                hasNextPage: index === parentConnections.length - 1
                  ? true
                  : pageInfo.hasNextPage
              }
            }
            debug('subscribe:event:total', {discussionId, data})

            client.writeFragment({
              id: dataIdFromObject(connection),
              fragment: fragments.connectionCounts,
              data
            })
          })
        },
        error (...args) {
          debug('subscribe:error', {discussionId, args})
        }
      })
      return () => {
        debug('subscribe:end', {discussionId})
        subscribtion.unsubscribe()
      }
    }
  })
})
)

export const upvoteComment = graphql(gql`
mutation discussionUpvoteComment($commentId: ID!) {
  upvoteComment(id: $commentId) {
    id
    upVotes
    downVotes
    score
    userVote
    updatedAt
  }
}
`, {
  props: ({mutate}) => ({
    upvoteComment: (commentId) => {
      return mutate({variables: {commentId}})
    }
  })
})

export const downvoteComment = graphql(gql`
mutation discussionDownvoteComment($commentId: ID!) {
  downvoteComment(id: $commentId) {
    id
    upVotes
    downVotes
    score
    userVote
    updatedAt
  }
}
`, {
  props: ({mutate}) => ({
    downvoteComment: (commentId) => {
      return mutate({variables: {commentId}})
    }
  })
})

export const submitComment = graphql(gql`
mutation discussionSubmitComment($discussionId: ID!, $parentId: ID, $id: ID!, $content: String!) {
  submitComment(id: $id, discussionId: $discussionId, parentId: $parentId, content: $content) {
    id
    content
    score
    userVote
    displayAuthor {
      profilePicture
      name
      credential {
        description
        verified
      }
    }
    createdAt
    updatedAt
  }
}
`, {
  props: ({ownProps: {discussionId, parentId: ownParentId, orderBy}, mutate}) => ({
    submitComment: (parentId, content) => {
      // Generate a new UUID for the comment. We do this client-side so that we can
      // properly handle subscription notifications.
      const id = uuid()
      pendingCommentIDs = [id, ...pendingCommentIDs]

      debug('submitComment', {discussionId, parentId, content, id})

      return mutate({
        variables: {discussionId, parentId, id, content},
        optimisticResponse: {
          __typename: 'Mutation',
          submitComment: {
            __typename: 'Comment',
            optimistic: true, // skip removing from pendingCommentIDs
            id,
            content,
            score: 0,
            userVote: null,
            displayAuthor: {
              __typename: 'DisplayUser',
              profilePicture: null,
              name: '',
              credential: {
                __typename: 'Credential',
                description: '',
                verified: false
              }
            },
            createdAt: (new Date()).toISOString(),
            updatedAt: (new Date()).toISOString()
          }
        },
        update: (proxy, {data: {submitComment}}) => {
          debug('submitComment:update:response', {discussionId, parentId, submitComment})

          const data = proxy.readQuery({
            query: rootQuery,
            variables: {discussionId, parentId: ownParentId, orderBy}
          })

          // Insert empty structures for the 'comments' field. The rootQuery
          // schema expects those to be present.
          const comment = {
            ...submitComment,
            comments: emptyCommentConnection(submitComment)
          }

          // Insert the newly created comment to the head of the given 'parent'
          // (which can be either the Discussion object or a Comment).
          const replaceComment = (parent) => {
            const nodes = parent.comments.nodes || []
            const existingComment = nodes.find(c => c.id === comment.id) || {}

            parent.comments.nodes = [
              {
                ...existingComment,
                ...comment
              },
              ...nodes.filter(c => c !== existingComment)
            ]
            parent.comments.totalCount = (parent.comments.totalCount || 0) + 1
          }

          if (parentId) {
            modifyComment(data.discussion, parentId, replaceComment)
          } else {
            replaceComment(data.discussion)
          }

          debug('submitComment:update:data', {discussionId, parentId, data})

          proxy.writeQuery({
            query: rootQuery,
            variables: {discussionId, parentId: ownParentId, orderBy},
            data
          })

          if (!submitComment.optimistic) {
            pendingCommentIDs = pendingCommentIDs.filter(id => id !== submitComment.id)
          }
        }
      }).catch(e => {
        // Convert the Error object into a string, but keep the Promise rejected.
        throw errorToString(e)
      })
    }
  })
})

const discussionPreferencesQuery = gql`
query discussionPreferences($discussionId: ID!) {
  me {
    id
    credentials {
      description
    }
  }
  discussion(id: $discussionId) {
    id
    rules {
      maxLength
      minInterval
      anonymity
    }
    userPreference {
      anonymity
      credential {
        description
        verified
      }
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
    }
    displayAuthor {
      id
      name
      credential {
        description
        verified
      }
      profilePicture
    }
  }
}
`, {
  props: ({ownProps: {discussionId}, mutate}) => ({
    setDiscussionPreferences: (anonymity, credential) => {
      return mutate({
        variables: {
          discussionId,
          discussionPreferences: {
            anonymity,
            credential
          }
        },
        update: (proxy, {data: {setDiscussionPreferences}}) => {
          const immutableData = proxy.readQuery({
            query: discussionPreferencesQuery,
            variables: {discussionId}
          })

          // clone() the data object so that we can mutate it in-place.
          const data = JSON.parse(JSON.stringify(immutableData))
          data.discussion.userPreference = setDiscussionPreferences.userPreference
          data.discussion.displayAuthor = setDiscussionPreferences.displayAuthor

          proxy.writeQuery({
            query: discussionPreferencesQuery,
            variables: {discussionId},
            data
          })
        }
      }).catch(e => {
        // Convert the Error object into a string, but keep the Promise rejected.
        throw errorToString(e)
      })
    }
  })
})
