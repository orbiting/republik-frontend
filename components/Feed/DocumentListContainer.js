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
    const { query, getDocuments, placeholder } = this.props

    return (
      <Query query={query}>
        {({ loading, error, data, fetchMore }) =>
          <Loader
            loading={loading}
            error={error}
            render={() => {
              const { documents } = getDocuments(data)
              const isEmpty = documents && documents.totalCount < 1
              if (isEmpty) {
                return placeholder
              } else {
                const hasMore = documents && documents.pageInfo.hasNextPage
                return (
                  <>
                    <DocumentList
                      data={getDocuments(data)}
                      hasMore={hasMore}
                      loadMore={makeLoadMore(fetchMore, data)}
                    />
                  </>
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
  getDocuments: e => e
}

DocumentListContainer.propTypes = {
  query: PropTypes.object.isRequired,
  getDocuments: PropTypes.func,
  placeholder: PropTypes.element
}

export default DocumentListContainer
