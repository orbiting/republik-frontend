import {gql, graphql} from 'react-apollo'

const meQuery = gql`
query meQuery($discussionId: ID!) {
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
  me {
    id
    name
    publicUser {
      testimonial {
        image(size: SHARE)
      }
    }
  }
}
`
export const withMe = graphql(meQuery, {
  variables: ({discussionId}) => ({discussionId})
})

export const fetchMoreQuery = gql`
query fetchMoreQuery($discussionId: ID!, $orderBy: DiscussionOrder!, $parentId: ID, $after: String) {
  discussion(id: $discussionId) {
    comments(parentId: $parentId, after: $after, orderBy: $orderBy, first: 1) {
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

export const commentsSubscription = gql`
subscription($discussionId: ID!) {
  comments(discussionId: $discussionId) {
    parent {
      id
    }
  }
}
`

const rootQuery = gql`
query rootQuery($discussionId: ID!, $orderBy: DiscussionOrder!) {
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
    comments(orderBy: $orderBy, first: 3) @connection(key: "comments", filter: ["orderBy"]) {
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

export const withData = graphql(rootQuery, {
  variables: ({discussionId, orderBy}) => ({discussionId, orderBy}),
  props: ({ownProps: {discussionId, orderBy}, data: {fetchMore, subscribeToMore, ...data}}) => ({
    data,
    fetchMore: (parentId, after) => fetchMore({
      query: fetchMoreQuery,
      variables: {discussionId, orderBy, parentId, after},
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
          nodes.forEach(c => { c.comments.nodes = [] })

          if (parentId) {
            const insertResponse = (parent) => {
              if (parent.id === parentId) {
                parent.comments.totalCount = totalCount
                parent.comments.pageInfo = pageInfo
                parent.comments.nodes = [...parent.comments.nodes, ...nodes]
              } else if (parent.comments && parent.comments.nodes) {
                parent.comments.nodes.forEach(insertResponse)
              }
            }
            result.discussion.comments.nodes.forEach(insertResponse)
          } else {
            result.discussion.comments.totalCount = totalCount
            result.discussion.comments.pageInfo = pageInfo
            result.discussion.comments.nodes = [...result.discussion.comments.nodes, ...nodes]
          }
        }

        return result
      }
    }),
    subscribeToMore: () => subscribeToMore({
      document: commentsSubscription,
      variables: {discussionId},
      updateQuery: (previousResult, { subscriptionData: {data: {comments: comment}}, variables }) => {
        // clone()
        const result = JSON.parse(JSON.stringify(previousResult))

        if (comment) {
          const {parent} = comment
          if (parent) {
            const parentId = parent.id
            const insertResponse = (parent) => {
              if (parent.id === parentId) {
                if (!parent.comments) { parent.comments = {} }
                if (!parent.comments.pageInfo) { parent.comments.pageInfo = {} }
                parent.comments.pageInfo.hasNextPage = true
              } else if (parent.comments && parent.comments.nodes) {
                parent.comments.nodes.forEach(insertResponse)
              }
            }
            result.discussion.comments.nodes.forEach(insertResponse)
          } else {
            result.discussion.comments.pageInfo.hasNextPage = true
          }
        }

        return result
      }
    })
  })
})

export const upvoteComment = graphql(gql`
mutation upvoteCommentMutation($commentId: ID!) {
  upvoteComment(id: $commentId) {
    id
    upVotes
    downVotes
    score
    userVote
    updatedAt
    hottnes
  }
}
`, {
  props: ({mutate}) => ({
    upvoteComment: (commentId) => { mutate({variables: {commentId}}) }
  })
})

export const downvoteComment = graphql(gql`
mutation downvoteCommentMutation($commentId: ID!) {
  downvoteComment(id: $commentId) {
    id
    upVotes
    downVotes
    score
    userVote
    updatedAt
    hottnes
  }
}
`, {
  props: ({mutate}) => ({
    downvoteComment: (commentId) => { mutate({variables: {commentId}}) }
  })
})

export const submitComment = graphql(gql`
mutation submitCommentMutation($discussionId: ID!, $parentId: ID, $content: String!) {
  submitComment(discussionId: $discussionId, parentId: $parentId, content: $content) {
    id
    content
    score
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
  props: ({ownProps: {discussionId, orderBy}, mutate}) => ({
    submitComment: (parentId, content) => {
      mutate({
        variables: {discussionId, parentId, content},
        optimisticResponse: {
          submitComment: {
            __typename: 'Comment',
            id: '15253f1c-0a54-4d66-87c9-1fca73d51936',
            content,
            score: 0,
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
          const data = proxy.readQuery({query: rootQuery, variables: {discussionId, orderBy}})

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

          if (parentId) {
            const insertResponse = (parent) => {
              if (parent.id === parentId) {
                parent.comments.nodes = [comment, ...parent.comments.nodes]
              } else if (parent.comments && parent.comments.nodes) {
                parent.comments.nodes.forEach(insertResponse)
              }
            }
            data.discussion.comments.nodes.forEach(insertResponse)
          } else {
            data.discussion.comments.nodes = [comment, ...data.discussion.comments.nodes]
          }

          proxy.writeQuery({
            query: rootQuery,
            variables: {discussionId, orderBy},
            data
          })
        }
      })
    }
  })
})
