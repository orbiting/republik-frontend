import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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

const getSearchResults = gql`
query getSearchResults(
    $search: String,
    $after: String,
    $sort: SearchSortInput,
    $filters: [SearchGenericFilterInput!],
    $trackingId: ID) {
  search(
      first: 100,
      after: $after,
      search: $search,
      sort: $sort,
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
    pageInfo {
      hasNextPage
      endCursor
      hasPreviousPage
      startCursor
    }
    nodes {
      entity {
        __typename
        ... on Document {
          meta {
            title
            color
            path
            kind
            template
            description
            credits
            publishDate
            format {
              meta {
                path
                title
                color
                kind
              }
            }
          }
        }
        ... on Comment {
          id
          content
          text
          preview(length:240) {
            string
            more
          }
          createdAt
          displayAuthor {
            id
            name
            username
            profilePicture
            credential {
              description
              verified
            }
          }
          published
          updatedAt
          discussion {
            id
            title
            path
          }
        }
        ... on User {
          id
          username
          firstName
          lastName
          credentials {
            verified
            description
            isListed
          }
          portrait
          hasPublicProfile
        }
      }
      highlights {
        path
        fragments
      }
      score
    }
  }
}
`

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

export const withResults = graphql(getSearchResults, {
  options: props => ({
    variables: {
      search: props.searchQuery,
      sort: props.sort,
      filters: props.filters,
      trackingId: props.trackingId
    }
  }),
  props: ({ data, ownProps }) => ({
    data,
    fetchMore: ({ after }) =>
      data.fetchMore({
        variables: {
          after,
          search: ownProps.searchQuery,
          sort: ownProps.sort,
          filters: ownProps.filters,
          trackingId: ownProps.trackingId
        },
        updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
          const nodes = [
            ...previousResult.search.nodes,
            ...fetchMoreResult.search.nodes
          ]
          return {
            ...previousResult,
            totalCount: fetchMoreResult.search.pageInfo.hasNextPage
              ? fetchMoreResult.search.totalCount
              : nodes.length,
            search: {
              ...previousResult.search,
              ...fetchMoreResult.search,
              nodes
            }
          }
        }
      })
  })
})
