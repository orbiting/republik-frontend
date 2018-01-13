import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import uuid from 'uuid/v4'
import mkDebug from 'debug'
import { errorToString } from '../../lib/utils/errors'
import { dataIdFromObject } from '../../lib/apollo/initApollo'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import withAuthorization from '../Auth/withAuthorization'
const debug = mkDebug('discussion')

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

const emptyCommentConnection = comment => ({
  __typename: 'CommentConnection',
  id: comment.id,
  totalCount: 0,
  nodes: [],
  pageInfo: emptyPageInfo()
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

export const fragments = {
  comment: gql`
    fragment Comment on Comment {
      id
      content
      published
      adminUnpublished
      score
      userVote
      userCanEdit
      displayAuthor {
        id
        name
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

// local only
// used for inserting single nodes
fragments.connectionNodes = gql`
fragment ConnectionNodes on CommentConnection {
  id
  nodes {
    ...Comment
    comments {
      ...ConnectionInfo
      # we need to set an empty array here
      nodes {
        id
      }
    }
  }
}
${fragments.comment}
${fragments.connectionInfo}
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

${fragments.connectionInfo}
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

const upsertDebug = mkDebug('discussion:upsertComment')

const upsertComment = (proxy, discussionId, comment, {prepend = false, subscription} = {}) => {
  upsertDebug('start', {discussionId, commentId: comment.id, prepend})

  const readConnection = id =>
    proxy.readFragment({
      id: dataIdFromObject({
        __typename: 'CommentConnection',
        id: id
      }),
      fragment: fragments.connectionInfo
    })

  const parentConnections = [discussionId].concat(comment.parentIds)
    .map(readConnection)
    .filter(Boolean)
  const directParentConnection = parentConnections[parentConnections.length - 1]

  const parentConnectionOptimistic = proxy.readFragment({
    id: dataIdFromObject(directParentConnection),
    fragment: fragments.connectionNodes,
    fragmentName: 'ConnectionNodes'
  }, true)
  const existingOptimisticComment = parentConnectionOptimistic.nodes.find(n => n.id === comment.id)

  const parentConnection = proxy.readFragment({
    id: dataIdFromObject(directParentConnection),
    fragment: fragments.connectionNodes,
    fragmentName: 'ConnectionNodes'
  })
  const existingComment = parentConnection.nodes.find(n => n.id === comment.id)

  upsertDebug('existing', !!existingComment, 'optimistic', !!existingOptimisticComment)
  if (existingComment) {
    proxy.writeFragment({
      id: dataIdFromObject(comment),
      fragment: fragments.comment,
      data: comment
    })
    return
  }

  // got a subscription for a comment in optimistic state
  // - already bumped totals optimistically
  // - once the update comes through it will write
  //   the changes permanently with prepend
  if (existingOptimisticComment && subscription) {
    return
  }

  parentConnections.forEach(connection => {
    const directParent = connection === directParentConnection

    const pageInfo = connection.pageInfo || emptyPageInfo()
    const data = {
      ...connection,
      totalCount: connection.totalCount + 1,
      pageInfo: {
        ...pageInfo,
        hasNextPage: directParent && !prepend
          ? true
          : pageInfo.hasNextPage
      }
    }
    upsertDebug('inc connection', {connectionId: connection.id, data})

    proxy.writeFragment({
      id: dataIdFromObject(connection),
      fragment: fragments.connectionInfo,
      data
    })
  })

  if (prepend) {
    const insertComment = {
      ...comment,
      comments: emptyCommentConnection(comment)
    }

    const data = {
      ...parentConnection,
      nodes: [
        insertComment,
        ...parentConnection.nodes
      ]
    }
    upsertDebug('prepend', {connectionId: data.id, data})

    proxy.writeFragment({
      id: dataIdFromObject(parentConnection),
      fragment: fragments.connectionNodes,
      fragmentName: 'ConnectionNodes',
      data
    })
  }
}

// Convert the Error object into a string, but keep the Promise rejected.
const toRejectedString = e => Promise.reject(errorToString(e))

export const withData = compose(
withMe,
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
      const subscription = client.subscribe({
        query: commentsSubscription,
        variables: {discussionId}
      }).subscribe({
        next ({data, errors}) {
          if (errors) {
            debug('subscribe:event:errors', {discussionId, errors})
            return
          }
          const { node: comment, mutation } = data.comment
          debug('subscribe:event', {discussionId, mutation, comment})

          if (mutation !== 'CREATED') {
            return
          }
          // workaround for https://github.com/apollographql/apollo-client/issues/2222
          const proxyWithOptimisticReadSupport = {
            readFragment: (...args) => client.cache.readFragment(...args),
            readQuery: (...args) => client.cache.readQuery(...args),
            writeFragment: (...args) => client.writeFragment(...args),
            writeQuery: (...args) => client.writeQuery(...args)
          }
          upsertComment(proxyWithOptimisticReadSupport, discussionId, comment, {
            subscription: true
          })
        },
        error (...args) {
          debug('subscribe:error', {discussionId, args})
        }
      })
      return () => {
        debug('subscribe:end', {discussionId})
        subscription.unsubscribe()
      }
    }
  })
})
)

export const upvoteComment = graphql(gql`
mutation discussionUpvoteComment($commentId: ID!) {
  upvoteComment(id: $commentId) {
    ...Comment
  }
}
${fragments.comment}
`, {
  props: ({mutate}) => ({
    upvoteComment: (commentId) => {
      return mutate({variables: {commentId}}).catch(toRejectedString)
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
  props: ({mutate}) => ({
    downvoteComment: (commentId) => {
      return mutate({variables: {commentId}}).catch(toRejectedString)
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
  props: ({mutate}) => ({
    unpublishComment: (commentId) => {
      return mutate({variables: {commentId}}).catch(toRejectedString)
    }
  })
})

export const editComment = graphql(gql`
mutation discussionEditComment($commentId: ID!, $content: String!) {
  editComment(id: $commentId, content: $content) {
    ...Comment
  }
}
${fragments.comment}
`, {
  props: ({mutate}) => ({
    editComment: (comment, content) => {
      return mutate({
        variables: {commentId: comment.id, content},
        optimisticResponse: {
          __typename: 'Mutation',
          submitComment: {
            ...comment,
            content
          }
        }
      }).catch(toRejectedString)
    }
  })
})

export const query = gql`
query discussion($discussionId: ID!, $parentId: ID, $after: String, $orderBy: DiscussionOrder!) {
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
    comments(parentId: $parentId, after: $after, orderBy: $orderBy, first: 5, flatDepth: 3) @connection(key: "comments", filter: ["parentId", "orderBy"]) {
      totalCount
      directTotalCount
      pageInfo {
        hasNextPage
        endCursor
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
  }
}
${fragments.comment}
`, {
  props: ({ownProps: {t, discussionId, parentId: ownParentId, orderBy, discussionDisplayAuthor}, mutate}) => ({
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
        variables: {discussionId, parentId, id, content},
        optimisticResponse: {
          __typename: 'Mutation',
          submitComment: {
            id,
            content,
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
        update: (proxy, {data: {submitComment}}) => {
          debug('submitComment', submitComment.id, submitComment)
          const data = proxy.readQuery({
            query: query,
            variables: {discussionId, parentId: ownParentId, orderBy}
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

          if (parentIndex) {
            const parent = nodes[parentIndex]
            nodes.splice(parentIndex, 1, {
              ...parent,
              comments: {
                ...parent.comments,
                totalCount: parent.comments.totalCount + 1,
                directTotalCount: parent.comments.directTotalCount + 1
              }
            })
          }

          proxy.writeQuery({
            query: query,
            variables: {discussionId, parentId: ownParentId, orderBy},
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
      }).catch(toRejectedString)
    }
  })
})
