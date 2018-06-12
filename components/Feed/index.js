import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { nest } from 'd3-collection'
import { timeFormat } from '../../lib/utils/format'
import { css } from 'glamor'
import gql from 'graphql-tag'
import Loader from '../../components/Loader'
import Link from '../Link/Href'
import withT from '../../lib/withT'
import StickyHeader from './StickyHeader'
import PropTypes from 'prop-types'
import formatCredits from './formatCredits'

import {
  Center,
  TeaserFeed,
  Interaction,
  mediaQueries
} from '@project-r/styleguide'
import Button from '@project-r/styleguide/lib/components/Button'

const SIDEBAR_WIDTH = 120
const MARGIN_WIDTH = 20

const styles = {
  container: css({
    padding: '15px 15px 120px',
    [mediaQueries.mUp]: {
      padding: '40px 0 120px'
    }
  }),
  header: css({
    backgroundColor: '#fff',
    margin: '0 0 30px 0',
    width: '100%',
    height: 27,
    [mediaQueries.lUp]: {
      height: 'auto',
      float: 'left',
      margin: `0 0 30px -${SIDEBAR_WIDTH + MARGIN_WIDTH}px`,
      width: SIDEBAR_WIDTH,
      '& > div': {
        width: SIDEBAR_WIDTH
      }
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

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(d => dateFormat(new Date(d.meta.publishDate)))

class Feed extends Component {
  constructor (props) {
    super(props)
    this.pagesLoaded = 0
    this.state = {
      infiniteScroll: false
    }
    this.onScroll = () => {
      const { infiniteScroll } = this.state
      const { loadMore, hasMore, maxPages } = this.props
      const d = document.documentElement
      const scrollTop = Math.max(window.pageYOffset, d.scrollTop, document.body.scrollTop)
      const offset = scrollTop + window.innerHeight
      const height = d.offsetHeight
      const needsMore = height - offset < (height / 3)
      if ((infiniteScroll || this.pagesLoaded < maxPages) && hasMore && needsMore) {
        loadMore()
        this.pagesLoaded += 1
      }
    }
    this.activateInfiniteScroll = async () => {
      const { loadMore } = this.props
      await loadMore()
      this.setState({infiniteScroll: true})
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
    const { data: { loading, error, documents, greeting }, hasMore, t } = this.props
    const { infiniteScroll } = this.state
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
                groupByDate.entries(nodes).map(({key, values}) =>
                  <section>
                    <div {...styles.header}>
                      <StickyHeader>
                        <span {...styles.date}>
                          {key}
                        </span>
                      </StickyHeader>
                    </div>
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
                  </section>
                )
              }
              {!infiniteScroll && hasMore &&
                <Button onClick={this.activateInfiniteScroll}>{t('format/feed/loadMore')}</Button>
              }
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
  maxPages: PropTypes.number,
  t: PropTypes.func.isRequired
}

Feed.defaultProps = {
  maxPages: 3
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
  ),
  withT
)(Feed)
