import {gql, graphql} from 'react-apollo'
import uuid from 'uuid/v4'
import mkDebug from 'debug'
import {errorToString} from '../../lib/utils/errors'
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

const emptyCommentConnection = () => ({
  __typename: 'CommentConnection',
  totalCount: 0,
  nodes: [],
  pageInfo: emptyPageInfo()
})

const meQuery = gql`
query discussionMe($discussionId: ID!) {
  me {
    id
    name
    publicUser {
      testimonial {
        image(size: SHARE)
      }
    }
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
  }
}
`
export const withMe = graphql(meQuery)

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

export const commentsSubscription = gql`
subscription discussionComments($discussionId: ID!) {
  comments(discussionId: $discussionId) {
    id
    upVotes
    downVotes
    score
    userVote
    updatedAt
    parent {
      id
    }
  }
}
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
    publicUser {
      testimonial {
        image(size: SHARE)
      }
    }
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
  totalCount
  pageInfo {
    hasNextPage
    endCursor
  }
}

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
  createdAt
}
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

export const withData = graphql(rootQuery, {
  props: ({ownProps: {discussionId, orderBy}, data: {fetchMore, subscribeToMore, ...data}}) => ({
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
    subscribeToMore: () => subscribeToMore({
      document: commentsSubscription,
      variables: {discussionId},
      updateQuery: (previousResult, { subscriptionData: {data: {comments: comment}}, variables }) => {
        debug('subscribeToMore:updateQuery:event', {discussionId, comment})

        // In which situations does this happen?
        if (!comment) {
          return previousResult
        }

        // Ignore events for comments which were created by this client.
        if (pendingCommentIDs.indexOf(comment.id) !== -1) {
          return previousResult
        }

        // Given the parent object (either a Discussion or a Comment) of the comment we want
        // to insert, either update the comment (if the comment already exists in the list)
        // or otherwise bump the count of the CommentConnection and enable the hasNextPage flag.
        const go = (parent) => {
          if (!parent.comments) {
            parent.comments = emptyCommentConnection()
          }
          if (!parent.comments.pageInfo) {
            parent.comments.pageInfo = emptyPageInfo()
          }
          if (!parent.comments.nodes) {
            parent.comments.nodes = []
          }

          const existingComment = parent.comments.nodes.find(c => c.id === comment.id)
          if (existingComment) {
            // Overwrite fields in 'existingComment' with whatever came fresh from the server.
            //
            // Would a deep-merge be better here? Currently all fields we fetch are primitive,
            // so updating them shouldn't cause any issues.
            for (const k in comment) {
              existingComment[k] = comment[k]
            }
            debug('subscribeToMore:updateQuery:existingComment', existingComment)
          } else {
            // Bump the total count and set the 'hasNextPage' flag. Let the 'submitComment'
            // mutation callback deal with resetting this if the current user submitted the
            // comment itself.
            parent.comments.totalCount = (parent.comments.totalCount || 0) + 1
            parent.comments.pageInfo.hasNextPage = true
            debug('subscribeToMore:updateQuery:insert', parent)
          }
        }

        const result = JSON.parse(JSON.stringify(previousResult))
        if (comment.parent) {
          modifyComment(result.discussion, comment.parent.id, go)
        } else {
          go(result.discussion)
        }

        return result
      }
    })
  })
})

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
          submitComment: {
            __typename: 'Comment',

            // Generate a temporary ID so that we don't remove the true id from
            // the 'pendingCommentIDs' list during the optimistic update of the
            // local cache.
            id: `t-${id}`,

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
            createdAt: (new Date()).toISOString()
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
            comments: emptyCommentConnection()
          }

          // Insert the newly created comment to the head of the given 'parent'
          // (which can be either the Discussion object or a Comment).
          const insertComment = (parent) => {
            if (!parent.comments) {
              parent.comments = emptyCommentConnection()
            }

            parent.comments.nodes = [comment, ...(parent.comments.nodes || [])]
            parent.comments.totalCount = (parent.comments.totalCount || 0) + 1
          }

          if (parentId) {
            modifyComment(data.discussion, parentId, insertComment)
          } else {
            insertComment(data.discussion)
          }

          debug('submitComment:update:data', {discussionId, parentId, data})

          proxy.writeQuery({
            query: rootQuery,
            variables: {discussionId, parentId: ownParentId, orderBy},
            data
          })

          pendingCommentIDs = pendingCommentIDs.filter(id => id !== submitComment.id)
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
    publicUser {
      credentials {
        description
      }
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
