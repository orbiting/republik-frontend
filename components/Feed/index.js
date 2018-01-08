import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import ArticleLink from '../Link/Article'

import { Center, TeaserFeed, Interaction, mediaQueries } from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '15px 15px 120px',
    [mediaQueries.mUp]: {
      padding: '40px 0 120px'
    }
  })
}

const getDocuments = gql`
  query getDocuments {
    greeting {
      text
      id
    }
    documents(feed: true) {
      nodes {
        meta {
          kind
          credits
          title
          description
          publishDate
          path
        }
      }
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

  componentWillUnmount () {
    this.unsubscribe && this.unsubscribe()
  }

  render () {
    const { data: { loading, error, documents, greeting } } = this.props
    return (
      <Loader
        loading={loading}
        error={error}
        render={() => {
          return (
            <Center {...styles.container}>
              {greeting && (
                <Interaction.H1 style={{ marginBottom: '40px' }}>
                  {greeting.text}
                </Interaction.H1>
              )}
              {documents &&
                documents.nodes.map(doc => (
                  <TeaserFeed
                    {...doc.meta}
                    Link={ArticleLink}
                    key={doc.meta.slug}
                  />
                ))}
            </Center>
          )
        }}
      />
    )
  }
}

export default compose(
  graphql(getDocuments)
)(Feed)
