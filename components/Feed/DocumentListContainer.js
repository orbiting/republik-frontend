import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Loader from '../Loader'
import DocumentList from './DocumentList'

export const documentQueryFragment = `
  documents(first: 50, after: $cursor) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    nodes {
      id
      meta {
        credits
        title
        description
        publishDate
        path
        kind
        template
        color
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
  }
`

const makeLoadMore = (fetchMore, data) => () =>
  fetchMore({
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const nodes = [
        ...previousResult.documents.nodes,
        ...fetchMoreResult.documents.nodes
      ].filter(
        (node, index, all) =>
          all.findIndex(n => n.id === node.id) === index // deduplicating due to off by one in pagination API
      )
      return {
        ...fetchMoreResult,
        documents: {
          ...fetchMoreResult.documents,
          nodes
        }
      }
    },
    variables: {
      cursor: data.documents.pageInfo.endCursor
    }
  })

class DocumentListContainer extends Component {
  render () {
    const { query, processResult } = this.props

    return (
      <Query query={query}>
        {({ loading, error, data, subscribeToMore, fetchMore }) => {
          const processedData = processResult(data)
          const hasMore = processedData.documents && processedData.documents.pageInfo.hasNextPage

          return (
            <Loader
              loading={loading}
              error={error}
              render={() => {
                return (
                  <>
                    {
                      this.props.renderBefore instanceof Function
                        ? this.props.renderBefore(data)
                        : null
                    }
                    <DocumentList
                      data={processedData}
                      hasMore={hasMore}
                      loadMore={makeLoadMore(fetchMore, data)}
                      subscribeToMore={subscribeToMore}
                    />
                  </>
                )
              }}
            />
          )
        }}
      </Query>
    )
  }
}

DocumentListContainer.defaultProps = {
  processResult: e => e
}

DocumentListContainer.propTypes = {
  query: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      kind: PropTypes.string,
      definitions: PropTypes.array
    })
  ]),
  processResult: PropTypes.func,
  renderBefore: PropTypes.func
}

export default DocumentListContainer
