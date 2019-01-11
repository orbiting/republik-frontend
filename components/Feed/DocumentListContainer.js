import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Loader from '../Loader'
import DocumentList from './DocumentList'

import {
  onDocumentFragment as bookmarkOnDocumentFragment
} from '../Bookmarks/fragments'

export const documentFragment = `
  fragment DocumentListDocument on Document {
    id
    ...BookmarkOnDocument
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
      indicateChart
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
  ${bookmarkOnDocumentFragment}
`

export const documentListQueryFragment = `
  fragment DocumentListConnection on DocumentConnection {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    nodes {
      ...DocumentListDocument
    }
  }
  ${documentFragment}
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
    const { query, getConnection, filterDocuments, mapNodes, placeholder } = this.props

    return (
      <Query query={query}>
        {({ loading, error, data, fetchMore }) =>
          <Loader
            loading={loading}
            error={error}
            render={() => {
              const connection = getConnection(data)
              const isEmpty = connection.totalCount < 1
              if (isEmpty) {
                return placeholder
              } else {
                const hasMore = connection.pageInfo.hasNextPage
                return (
                  <DocumentList
                    documents={connection.nodes.filter(filterDocuments).map(mapNodes)}
                    totalCount={connection.totalCount}
                    unfilteredCount={connection.nodes.length}
                    hasMore={hasMore}
                    loadMore={makeLoadMore(fetchMore, data)}
                  />
                )
              }
            }}
          />
        }
      </Query>
    )
  }
}

DocumentListContainer.defaultProps = {
  getConnection: data => data.documents,
  filterDocuments: () => true,
  mapNodes: e => e
}

DocumentListContainer.propTypes = {
  query: PropTypes.object.isRequired,
  getConnection: PropTypes.func.isRequired,
  filterDocuments: PropTypes.func.isRequired,
  mapNodes: PropTypes.func.isRequired,
  placeholder: PropTypes.element
}

export default DocumentListContainer
