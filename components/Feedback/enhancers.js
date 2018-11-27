import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const getActiveDiscussions = gql`
query getActiveDiscussions($lastDays: Int!) {
  activeDiscussions(lastDays: $lastDays) {
    beginDate
    endDate
    count
    discussion {
      id
      title
      path
      document {
        id
        meta {
          title
          template
        }
      }
    }
  }
}
`

export const getArticleSearchResults = gql`
query getArticleSearchResults(
  $search: String,
  $after: String,
  $sort: SearchSortInput,
  $filters: [SearchGenericFilterInput!],
  $trackingId: ID
) {
  search(
    first: 5,
    after: $after,
    search: $search,
    sort: $sort,
    filters: $filters,
    trackingId: $trackingId
  ) {
    nodes {
      entity {
        __typename
        ... on Document {
          meta {
            title
            path
            credits
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

const getComments = gql`
query getComments($after: String) {
  comments(
    first: 10,
    after: $after,
    orderBy: DATE,
    orderDirection: DESC) {
      id
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        text
        content
        published
        adminUnpublished
        downVotes
        upVotes
        userVote
        userCanEdit
        preview(length:240) {
          string
          more
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
        updatedAt
        createdAt
        parentIds
        discussion {
          id
          title
          path
        }
      }
    }
}
`

export const withActiveDiscussions = graphql(getActiveDiscussions, {
  options: props => ({
    variables: {
      lastDays: props.lastDays || 7
    }
  })
})

export const withComments = graphql(getComments, {
  options: props => ({
    variables: {
    }
  }),
  props: ({ data, ownProps }) => ({
    data,
    fetchMore: ({ after }) =>
      data.fetchMore({
        variables: {
          after
        },
        updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
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
              ...previousResult.search,
              ...fetchMoreResult.search,
              nodes
            }
          }
        }
      })
  })
})
