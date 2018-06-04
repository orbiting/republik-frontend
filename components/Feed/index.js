import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { nest } from 'd3-collection'
import { timeFormat } from '../../lib/utils/format'
import { css } from 'glamor'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import Link from '../Link/Href'

import {
  HEADER_HEIGHT
} from '../constants'

import {
  Center,
  TeaserFeed,
  Interaction,
  mediaQueries
} from '@project-r/styleguide'

const styles = {
  container: css({
    padding: '15px 15px 120px',
    [mediaQueries.mUp]: {
      padding: '40px 0 120px'
    }
  }),
  feed: css({
    borderTop: `1px solid #000`,
    backgroundColor: '#fff',
    paddingTop: '8px',
    margin: '0 0 30px 0',
    float: 'none',
    width: '100%',
    [mediaQueries.mUp]: {
      margin: '0 0 30px -150px',
      float: 'left',
      width: 150
    }
  })
}

const getDocuments = gql`
  query getDocuments($cursor: String) {
    greeting {
      text
      id
    }
    documents(feed: true, first: 10, after: $cursor) { 
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

const dateFormat = timeFormat('%A, %d. %B %Y')

const groupBy = nest().key(d => dateFormat(new Date(d.meta.publishDate)))

class StickyHeader extends Component {
  constructor (props) {
    super(props)
    this.originalOffset = null
    this.state = {
      sticky: false
    }
    this.ref = null
    this.setRef = (el) => { this.ref = el }

    this.onScroll = () => {
      const y = window.pageYOffset
      if (this.ref) {
        const { sticky } = this.state
        const currentOffset = this.ref.offsetTop
        const nextSticky = y + HEADER_HEIGHT > (sticky ? this.originalOffset : currentOffset)
        this.setState({ sticky: nextSticky })
      }
    }
  }

  componentDidMount () {
    this.originalOffset = this.ref.offsetTop
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  }

  render () {
    const {children} = this.props
    const { sticky } = this.state
    return (
      <div ref={this.setRef} style={{
        position: sticky ? 'fixed' : 'relative',
        top: sticky ? HEADER_HEIGHT : 'unset',
        backgroundColor: '#fff'
      }}>
        {
          children
        }
      </div>
    )
  }
}

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
    const { data: { loading, error, documents, greeting }, loadMore, hasMore } = this.props
    const nodes = documents
      ? [...documents.nodes].filter(node => node.meta.template !== 'format')
      : []
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
              {nodes &&
                groupBy.entries(nodes).map(({key, values}) =>
                  <div>
                    <div {...styles.feed}>
                      <StickyHeader>{key.split(',').join(',')}</StickyHeader>
                    </div>
                    <div style={{ }}>
                      {
                        values.map(doc =>
                          <TeaserFeed
                            {...doc.meta}
                            kind={
                              doc.meta.template === 'editorialNewsletter' ? (
                                'meta'
                              ) : (
                                doc.meta.kind
                              )
                            }
                            Link={Link}
                            key={doc.meta.path}
                          />
                        )
                      }
                    </div>
                  </div>
                )
              }
              {hasMore &&
                <button onClick={loadMore}>Load More</button>
              }
            </Center>
          )
        }}
      />
    )
  }
}

export default compose(
  graphql(
    getDocuments,
    {
      props: ({ data }) => ({
        data,
        hasMore: data.documents && data.documents.pageInfo.hasNextPage,
        loadMore: () => {
          return data.fetchMore({
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const nodes = [
                ...previousResult.documents.nodes,
                ...fetchMoreResult.documents.nodes
              ].filter((node, index, all) => all.findIndex(n => n.id === node.id) === index) // deduplicating due to off by one in pagination API
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
        }
      })
    }
  )
)(Feed)
