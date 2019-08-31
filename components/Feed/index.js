import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'
import Frame from '../Frame'
import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'
import Loader from '../Loader'

import {
  mediaQueries,
  Center,
  Interaction
} from '@project-r/styleguide'
import DocumentListContainer, { documentFragment } from './DocumentListContainer'

const styles = {
  container: css({
    paddingTop: 15,
    paddingBottom: 120,
    [mediaQueries.mUp]: {
      paddingTop: 40
    }
  })
}

const documentsQuery = gql`
  query getFeed($cursor: String) {
    documents: search(
      filters: [
        {key: "template", not: true, value: "format"},
        {key: "template", not: true, value: "front"}
      ], 
      filter: {feed: true},
      sort: {key: publishedAt, direction: DESC},
      first: 30,
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

const greetingQuery = gql`
  {
    greeting {
      text
      id
    }
  }
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
  componentDidMount () {
    this.subscribe()
  }

  componentDidUpdate () {
    this.subscribe()
  }

  componentWillUnmount () {
    this.unsubscribe && this.unsubscribe()
  }

  subscribe () {
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

  render () {
    const { meta, data: { error, loading, greeting } } = this.props

    return (
      <Frame raw meta={meta}>
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
                  <DocumentListContainer
                    query={documentsQuery}
                    mapNodes={node => node.entity}
                  />
                </>
              )
            }
            } />
        </Center>
      </Frame>
    )
  }
}

export default compose(
  graphql(greetingQuery),
  withT,
  withInNativeApp
)(Feed)
