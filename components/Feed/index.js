import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { nest } from 'd3-collection'
import { timeFormat } from '../../lib/utils/format'
import { css } from 'glamor'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import Link from '../Link/Href'
import withT from '../../lib/withT'
import StickySection from './StickySection'
import PropTypes from 'prop-types'
import formatCredits from './formatCredits'

import {
  A,
  Center,
  Spinner,
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
  more: css({
    position: 'relative',
    height: 50,
    padding: '10px 0 0 0'
  })
}

const getDocuments = gql`
  query getDocuments($cursor: String) {
    greeting {
      text
      id
    }
    documents(feed: true, first: 50, after: $cursor) {
      totalCount 
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

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(d => dateFormat(new Date(d.meta.publishDate)))

class Feed extends Component {
  constructor (props) {
    super(props)
    this.container = null
    this.setContainerRef = (el) => { this.container = el }
    this.state = {
      infiniteScroll: false,
      loadingMore: false
    }
    this.getRemainingDocumentsCount = (nodes) => {
      const { data: { documents } } = this.props
      return (documents.totalCount) - // all docs
              nodes.length - // already displayed
              (documents.nodes.length - nodes.length) // formats
    }
    this.onScroll = async () => {
      if (this.container) {
        const bbox = this.container.getBoundingClientRect()
        if (bbox.bottom < window.innerHeight * 10) {
          const { loadMore, hasMore } = this.props
          const { infiniteScroll } = this.state
          if (infiniteScroll && hasMore) {
            this.setState({loadingMore: true})
            await loadMore()
            this.setState({loadingMore: false})
          }
        }
      }
    }
    this.activateInfiniteScroll = async (e) => {
      e.preventDefault()
      this.setState(
        {
          infiniteScroll: true,
          loadingMore: true
        },
        this.onScroll
      )
    }
  }

  componentDidMount () {
    this.subscribe()
    window.addEventListener('scroll', this.onScroll)
  }

  componentDidUpdate () {
    this.subscribe()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
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
    const { infiniteScroll, loadingMore } = this.state
    const { data: { loading, error, documents, greeting }, hasMore, t } = this.props
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
              <div ref={this.setContainerRef}>
                {nodes &&
                  groupByDate.entries(nodes).map(({key, values}, i, all) =>
                    <StickySection
                      key={i}
                      hasSpaceAfter={i < all.length - 1}
                      label={key}
                    >
                      {
                        values.map(doc =>
                          <TeaserFeed
                            {...doc.meta}
                            credits={formatCredits(doc.meta.credits)}
                            publishDate={undefined}
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
                    </StickySection>
                  )
                }
              </div>
              <div {...styles.more}>
                {loadingMore &&
                  <Spinner />
                }
                {!infiniteScroll && hasMore &&
                  <A href='#'
                    onClick={this.activateInfiniteScroll}>
                    {
                      t('feed/loadMore',
                        {
                          count: nodes.length,
                          remaining: this.getRemainingDocumentsCount(nodes)
                        }
                      )
                    }
                  </A>
                }
              </div>
            </Center>
          )
        }}
      />
    )
  }
}

Feed.propTypes = {
  data: PropTypes.object.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  t: PropTypes.func.isRequired
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
        }
      })
    }
  ),
  withT
)(Feed)
