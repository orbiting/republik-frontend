import {gql, graphql} from 'react-apollo'
import uuid from 'uuid/v4'

export const countNode = comment =>
  1 + (!comment.comments ? 0 : comment.comments.totalCount)

export const countNodes = nodes =>
  !nodes ? 0 : nodes.reduce((a, comment) => a + countNode(comment), 0)

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
export const withMe = graphql(meQuery, {
  variables: ({discussionId}) => ({discussionId})
})

export const commentsSubscription = gql`
subscription discussionComments($discussionId: ID!) {
  comments(discussionId: $discussionId) {
    id
    parent {
      id
    }
  }
}
`

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
      nodes {
        ...Comment
        comments {
          ...ConnectionInfo
          nodes {
            ...Comment
            comments {
              ...ConnectionInfo
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
  variables: ({discussionId, parentId, after, orderBy}) => ({
    discussionId, parentId, after, orderBy
  }),
  props: ({ownProps: {discussionId, orderBy}, data: {fetchMore, subscribeToMore, ...data}}) => ({
    data,
    fetchMore: (parentId, after) => fetchMore({
      variables: {discussionId, parentId, after, orderBy},
      updateQuery: (previousResult, {fetchMoreResult: {discussion}}) => {
        // previousResult is immutable. We clone the whole object, then recursively
        // iterate through the comments until we find the parent comment to which
        // to append the just fetched comments.

        // clone()
        const result = JSON.parse(JSON.stringify(previousResult))

        if (discussion && discussion.comments) {
          const {totalCount, pageInfo, nodes} = discussion.comments

          // In the fetchMoreQuery we don't fetch the child comment nodes. But the
          // rootQuery expects there 'nodes' exist in the first three or so levels.
          // Set it to an empty array to make apollo not freak out.
          nodes.forEach(({comments}) => { comments.nodes = [] })

          const insertNodes = (parent) => {
            if (!parent.comments) { parent.comments = {} }

            // When inserting the new nodes, filter out any comments which we
            // already have (which have been inserted through the `submitComment`
            // mutation or which have arrived through a subscription).
            const currentNodes = parent.comments.nodes || []
            const newNodes = nodes.filter(x => !currentNodes.some(y => y.id === x.id))

            parent.comments = {
              __typename: 'CommentConnection',
              totalCount,
              pageInfo,
              nodes: [...currentNodes, ...newNodes]
            }
          }

          if (parentId) {
            modifyComment(result.discussion, parentId, insertNodes)
          } else {
            insertNodes(result.discussion)
          }
        }

        return result
      }
    }),
    subscribeToMore: () => subscribeToMore({
      document: commentsSubscription,
      variables: {discussionId},
      updateQuery: (previousResult, { subscriptionData: {data: {comments: comment}}, variables }) => {
        if (!comment) {
          // In which situations does this happen?
          return previousResult
        }

        const {parent} = comment

        // clone() the result object
        const result = JSON.parse(JSON.stringify(previousResult))

        const bumpCommentCount = (parent) => {
          if (!parent.comments) {
            parent.comments = {
              totalCount: 0,
              nodes: []
            }
          }
          if (!parent.comments.pageInfo) {
            parent.comments.pageInfo = {
              __typename: 'PageInfo',
              hasNextPage: false,
              endCursor: null
            }
          }
          if (!parent.comments.nodes) {
            parent.comments.nodes = []
          }

          // Bump the total count and set the 'hasNextPage' flag. Let the 'submitComment'
          // mutation callback deal with resetting this if the current user submitted the
          // comment itself.
          parent.comments.totalCount = (parent.comments.totalCount || 0) + 1
          parent.comments.pageInfo.hasNextPage = true
        }

        if (parent) {
          modifyComment(result.discussion, parent.id, bumpCommentCount)
        } else {
          bumpCommentCount(result.discussion)
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
    upvoteComment: (commentId) => { mutate({variables: {commentId}}) }
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
    downvoteComment: (commentId) => { mutate({variables: {commentId}}) }
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

      mutate({
        variables: {discussionId, parentId, id, content},
        optimisticResponse: {
          submitComment: {
            __typename: 'Comment',
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
            createdAt: (new Date()).toISOString()
          }
        },
        update: (proxy, {data: {submitComment}}) => {
          const data = proxy.readQuery({
            query: rootQuery,
            variables: {discussionId, parentId: ownParentId, orderBy}
          })

          // Insert empty structures for the 'comments' field. The rootQuery
          // schema expects those to be present.
          const comment = {
            ...submitComment,
            comments: {
              __typename: 'CommentConnection',
              totalCount: 0,
              pageInfo: {
                __typename: 'PageInfo',
                hasNextPage: false,
                endCursor: null
              },
              nodes: []
            }
          }

          // Insert the newly created comment to the head of the given 'parent'
          // (which can be either the Discussion object or a Comment).
          const insertComment = (parent) => {
            if (!parent.comments) { parent.comments = {} }

            parent.comments.nodes = [comment, ...(parent.comments.nodes || [])]

            // If the totalCount is greater than what we can count ourselves, it means
            // the count was bumped inside the new comment subscription and we need to
            // unset the 'hasNextPage' flag.
            if (parent.comments.totalCount === countNodes(parent.comments.nodes)) {
              parent.comments.pageInfo.hasNextPage = false
            }
          }

          if (parentId) {
            modifyComment(data.discussion, parentId, insertComment)
          } else {
            insertComment(data.discussion)
          }

          proxy.writeQuery({
            query: rootQuery,
            variables: {discussionId, parentId: ownParentId, orderBy},
            data
          })
        }
      })
    }
  })
})
