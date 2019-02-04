import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Loader from '../Loader'
import DocumentList from './DocumentList'
import noop from 'lodash/noop'

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
      format {
        meta {
          path
          title
          color
          kind
        }
      }
      ownDiscussion {
        id
        closed
        comments {
          totalCount
        }
      }
      linkedDiscussion {
        id
        path
        closed
        comments {
          totalCount
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

const makeLoadMore = ({ fetchMore, connection, getConnection, mergeConnection }) => () =>
  fetchMore({
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const prevCon = getConnection(previousResult)
      const moreCon = getConnection(fetchMoreResult)
      const nodes = [
        ...prevCon.nodes,
        ...moreCon.nodes
      ].filter(
        // deduplicating due to off by one in pagination API
        (node, index, all) =>
          all.findIndex(n => n.id === node.id) === index
      )
      return mergeConnection(fetchMoreResult, {
        ...prevCon,
        ...moreCon,
        nodes
      })
    },
    variables: {
      cursor: connection.pageInfo.endCursor
    }
  })

class LifecycleWrapper extends Component {
  componentWillUnmount () {
    this.props.onComponentWillUnmount && this.props.onComponentWillUnmount()
  }
  render () {
    return this.props.children
  }
}

class DocumentListContainer extends Component {
  render () {
    const {
      query,
      getConnection,
      mergeConnection,
      filterDocuments,
      mapNodes,
      placeholder,
      help,
      feedProps,
      refetchOnUnmount
    } = this.props

    return (
      <Query query={query}>
        {({ loading, error, data, fetchMore, refetch }) =>
          <LifecycleWrapper onComponentWillUnmount={refetchOnUnmount ? refetch : noop}>
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
                    <div>
                      {help}
                      <DocumentList
                        documents={connection.nodes.filter(filterDocuments).map(mapNodes)}
                        totalCount={connection.totalCount}
                        unfilteredCount={connection.nodes.length}
                        hasMore={hasMore}
                        loadMore={makeLoadMore({ fetchMore, connection, getConnection, mergeConnection })}
                        feedProps={feedProps}
                      />
                    </div>
                  )
                }
              }}
            />
          </LifecycleWrapper>
        }
      </Query>
    )
  }
}

DocumentListContainer.defaultProps = {
  getConnection: data => data.documents,
  mergeConnection: (data, connection) => ({
    ...data,
    documents: connection
  }),
  filterDocuments: () => true,
  mapNodes: e => e
}

DocumentListContainer.propTypes = {
  query: PropTypes.object.isRequired,
  getConnection: PropTypes.func.isRequired,
  filterDocuments: PropTypes.func.isRequired,
  mapNodes: PropTypes.func.isRequired,
  placeholder: PropTypes.element,
  help: PropTypes.element,
  refetchOnUnmount: PropTypes.bool
}

export default DocumentListContainer
