import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Loader from '../Loader'
import DocumentList from './DocumentList'

export const documentListQueryFragment = `
  fragment DocumentListConnection on DocumentConnection {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    nodes {
      id
      userListItems {
        createdAt
        documentList {
          id
          name
        }
      }
      meta {
        credits
        title
        description
        publishDate
        path
        kind
        template
        color
        estimatedReadingMinutes
        indicateGallery
        indicateVideo
        audioSource {
          mp3
        }
        dossier {
          id
        }
        linkedDiscussion {
          id
          path
          closed
        }
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
    const { query, getDocuments } = this.props

    return (
      <Query query={query}>
        {({ loading, error, data, fetchMore }) => {
          const hasMore = data && data.documents && data.documents.pageInfo.hasNextPage

          return (
            <Loader
              loading={loading}
              error={error}
              render={() => {
                return (
                  <>
                    <DocumentList
                      data={getDocuments(data)}
                      hasMore={hasMore}
                      loadMore={makeLoadMore(fetchMore, data)}
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
  getDocuments: e => e
}

DocumentListContainer.propTypes = {
  query: PropTypes.object.isRequired,
  getDocuments: PropTypes.func
}

export default DocumentListContainer
