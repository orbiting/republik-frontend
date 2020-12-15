import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const getActiveDiscussions = gql`
  query getActiveDiscussions($lastDays: Int!, $first: Int) {
    activeDiscussions(lastDays: $lastDays, first: $first) {
      discussion {
        id
        title
        path
        closed
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
        comments {
          totalCount
        }
      }
    }
  }
`

const getComments = gql`
  query getComments(
    $first: Int!
    $after: String
    $orderBy: DiscussionOrder
    $discussionId: ID
    $discussionIds: [ID!]
    $toDepth: Int
    $lastId: ID
  ) {
    comments(
      first: $first
      after: $after
      orderBy: $orderBy
      discussionId: $discussionId
      discussionIds: $discussionIds
      toDepth: $toDepth
      lastId: $lastId
      orderDirection: DESC
    ) {
      id
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        preview(length: 240) {
          string
          more
        }
        published
        adminUnpublished
        displayAuthor {
          id
          name
          slug
          credential {
            description
            verified
          }
          profilePicture
        }
        updatedAt
        createdAt
        parentIds
        tags
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
    }
  }
`

const getDiscussionDocumentMeta = gql`
  query getDiscussionDocumentMeta($id: ID!) {
    discussion(id: $id) {
      id
      document {
        id
        meta {
          title
          template
          path
        }
      }
    }
  }
`

export const withActiveDiscussions = graphql(getActiveDiscussions, {
  options: props => ({
    variables: {
      lastDays: props.lastDays || 3,
      first: props.first
    }
  })
})

export const withComments = (defaultProps = {}) =>
  graphql(getComments, {
    options: ({ discussionId, discussionIds, toDepth, orderBy, first }) => {
      return {
        variables: {
          discussionId,
          discussionIds,
          toDepth,
          orderBy: defaultProps.orderBy || 'DATE',
          first: defaultProps.first || 10
        }
      }
    },
    props: ({ data, ownProps }) => ({
      data,
      fetchMore: ({ after }) =>
        data.fetchMore({
          variables: {
            after
          },
          updateQuery: (
            previousResult,
            { fetchMoreResult, queryVariables }
          ) => {
            const nodes = [
              ...previousResult.comments.nodes,
              ...fetchMoreResult.comments.nodes
            ]
            return {
              ...previousResult,
              totalCount: fetchMoreResult.comments.pageInfo.hasNextPage
                ? fetchMoreResult.comments.totalCount
                : nodes.length,
              comments: {
                ...previousResult.comments,
                ...fetchMoreResult.comments,
                nodes
              }
            }
          }
        })
    })
  })

export const withDiscussionDocumentMeta = graphql(getDiscussionDocumentMeta, {
  skip: props => !!props.meta || !props.discussionId,
  options: props => ({
    variables: {
      id: props.discussionId
    }
  }),
  props: ({ data, ownProps }) => ({
    documentMeta:
      data &&
      data.discussion &&
      data.discussion.document &&
      data.discussion.document.meta
  })
})
