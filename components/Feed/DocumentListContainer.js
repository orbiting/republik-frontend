import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Loader from '../Loader'
import DocumentList from './DocumentList'
import noop from 'lodash/noop'

import { onDocumentFragment as bookmarkOnDocumentFragment } from '../Bookmarks/fragments'

import { userProgressFragment } from '../Article/Progress/api'

// we do not query / use shortTitle here
// - initially we only use it on the front
// - once we have a lot of content we can start
//   to experiment with switching feeds to short titles
// tpr, 05.09.2019
export const documentFragment = `
  fragment DocumentListDocument on Document {
    id
    ...BookmarkOnDocument
    ...UserProgressOnDocument
    meta {
      credits
      title
      description
      publishDate
      prepublication
      path
      kind
      template
      color
      estimatedReadingMinutes
      estimatedConsumptionMinutes
      indicateChart
      indicateGallery
      indicateVideo
      audioSource {
        mp3
        aac
        ogg
        mediaId
        durationMs
      }
      dossier {
        id
      }
      format {
        id
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
  ${userProgressFragment}
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

const defaultProps = {
  getConnection: data => data.documents,
  mergeConnection: (data, connection) => ({
    ...data,
    documents: connection
  }),
  mapNodes: e => e,
  variables: {},
  placeholder: null
}

export const makeLoadMore = ({
  fetchMore,
  connection,
  getConnection = defaultProps.getConnection,
  mergeConnection = defaultProps.mergeConnection,
  mapNodes = defaultProps.mapNodes
}) => () =>
  fetchMore({
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const prevCon = getConnection(previousResult)
      const moreCon = getConnection(fetchMoreResult)
      const nodes = [...prevCon.nodes, ...moreCon.nodes].filter(
        // deduplicating due to off by one in pagination API
        (node, index, all) =>
          all.findIndex(n => mapNodes(n).id === mapNodes(node).id) === index
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
  componentWillUnmount() {
    this.props.onComponentWillUnmount && this.props.onComponentWillUnmount()
  }
  render() {
    return this.props.children
  }
}

class DocumentListContainer extends Component {
  render() {
    const {
      query,
      variables,
      getConnection,
      mergeConnection,
      mapNodes,
      placeholder,
      help,
      empty,
      feedProps,
      refetchOnUnmount,
      showTotal
    } = this.props

    return (
      <Query query={query} variables={variables}>
        {({ loading, error, data, fetchMore, refetch }) => (
          <LifecycleWrapper
            onComponentWillUnmount={refetchOnUnmount ? refetch : noop}
          >
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
                    <>
                      <DocumentList
                        documents={connection.nodes.map(mapNodes)}
                        totalCount={connection.totalCount}
                        hasMore={hasMore}
                        loadMore={makeLoadMore({
                          fetchMore,
                          connection,
                          getConnection,
                          mergeConnection,
                          mapNodes
                        })}
                        feedProps={feedProps}
                        showTotal={showTotal}
                        help={help}
                        empty={empty}
                        variables={variables}
                      />
                    </>
                  )
                }
              }}
            />
          </LifecycleWrapper>
        )}
      </Query>
    )
  }
}

DocumentListContainer.defaultProps = defaultProps

DocumentListContainer.propTypes = {
  query: PropTypes.object.isRequired,
  variables: PropTypes.object,
  getConnection: PropTypes.func.isRequired,
  mapNodes: PropTypes.func.isRequired,
  placeholder: PropTypes.element,
  refetchOnUnmount: PropTypes.bool,
  showTotal: PropTypes.bool,
  help: PropTypes.element
}

export default DocumentListContainer
