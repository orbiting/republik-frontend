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
import DocumentListContainer, { documentQueryFragment } from './DocumentListContainer'

const styles = {
  container: css({
    padding: '15px 15px 120px',
    [mediaQueries.mUp]: {
      padding: '40px 0 120px'
    }
  }),
  more: css({
    position: 'relative',
    height: 50,
    padding: '10px 0 0 0'
  })
}

const getDocuments = gql`
  query getDocuments($cursor: String) {
    ${documentQueryFragment}
  }
`

const getGreeting = gql`
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
                    query={getDocuments}
                    processData={data => ({
                      documents: {
                        ...data.documents,
                        nodes: data.documents.nodes
                          .filter(node => node.meta.template !== 'format' && node.meta.template !== 'front')
                      }
                    })}
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
  graphql(getGreeting),
  withT,
  withInNativeApp
)(Feed)
