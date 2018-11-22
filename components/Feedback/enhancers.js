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

const getSearchAggregations = gql`  
query getSearchAggregations( 
    $search: String, 
    $filters: [SearchGenericFilterInput!],
    $trackingId: ID) {
  search(  
      first: 1,  
      search: $search, 
      filters: $filters,
      trackingId: $trackingId) {
    totalCount
    trackingId
    aggregations {
      key
      count
      label
      buckets {
        value
        count
        label
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

export const withAggregations = graphql(getSearchAggregations, {
  skip: props => props.searchQuery === props.filterQuery,
  options: props => ({
    variables: {
      search: props.filterQuery,
      filters: props.filters,
      trackingId: props.trackingId
    }
  }),
  props: ({ data, ownProps }) => ({
    dataAggregations: data
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
