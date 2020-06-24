import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'
import Frame from '../Frame'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import Loader from '../Loader'

import { mediaQueries, Center, Interaction } from '@project-r/styleguide'
import DocumentList from './DocumentList'
import { makeLoadMore, documentFragment } from './DocumentListContainer'

const styles = {
  container: css({
    paddingTop: 15,
    paddingBottom: 120,
    [mediaQueries.mUp]: {
      paddingTop: 40
    }
  })
}

const query = gql`
  query getFeed($cursor: String) {
    greeting {
      text
      id
    }
    documents: search(
      filters: [
        { key: "template", not: true, value: "section" }
        { key: "template", not: true, value: "format" }
        { key: "template", not: true, value: "front" }
      ]
      filter: { feed: true }
      sort: { key: publishedAt, direction: DESC }
      first: 30
      after: $cursor
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        entity {
          ...DocumentListDocument
        }
      }
    }
  }
  ${documentFragment}
`

const greetingSubscription = gql`
  subscription {
    greeting {
      id
      text
    }
  }
`

class Feed extends Component {
  componentDidMount() {
    this.subscribe()
  }

  componentDidUpdate() {
    this.subscribe()
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  subscribe() {
    if (!this.unsubscribe && this.props.data.greeting) {
      this.unsubscribe = this.props.data.subscribeToMore({
        document: greetingSubscription,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev
          }
          const { greeting } = subscriptionData.data.greeting
          if (greeting) {
            return {
              ...prev,
              greeting: {
                ...greeting
              }
            }
          } else {
            return prev
          }
        }
      })
    }
  }

  render() {
    const {
      meta,
      data: { error, loading, greeting, documents: connection, fetchMore }
    } = this.props

    const mapNodes = node => node.entity

    return (
      <Frame hasOverviewNav={true} raw meta={meta}>
        <Center {...styles.container}>
          <Loader
            error={error}
            loading={loading}
            render={() => {
              return (
                <>
                  {greeting && (
                    <Interaction.H1 style={{ marginBottom: '40px' }}>
                      {greeting.text}
                    </Interaction.H1>
                  )}

                  <DocumentList
                    documents={connection.nodes.map(mapNodes)}
                    totalCount={connection.totalCount}
                    hasMore={connection.pageInfo.hasNextPage}
                    loadMore={makeLoadMore({
                      fetchMore,
                      connection,
                      mapNodes
                    })}
                  />
                </>
              )
            }}
          />
        </Center>
      </Frame>
    )
  }
}

export default compose(graphql(query), withT, withInNativeApp)(Feed)
