import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'
import timeago from '../../lib/timeago'
import withT from '../../lib/withT'

import Loader from '../../components/Loader'
import Link from '../Link/Href'

import Filter from './Filter'
import Sort from './Sort'
import UserTeaser from './UserTeaser'

import {
  Comment,
  TeaserFeed,
  Interaction,
  colors
} from '@project-r/styleguide'

const { P } = Interaction

const styles = {
  container: css({
    paddingTop: 0
  }),
  results: css({
    paddingTop: 60
  }),
  comment: css({
    borderTop: `1px solid ${colors.text}`,
    margin: '0 0 40px 0',
    paddingTop: 10
  })
}

const getSearchResults = gql`
query getSearchResults($search: String, $sort: SearchSortInput, $filters: [SearchGenericFilterInput!]) {
  search(first: 300, search: $search, sort: $sort, filters: $filters) {
    aggregations {
      key
      count
      buckets {
        value
        count
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      endCursor
      hasPreviousPage
      startCursor
    }
    nodes {
      entity {
        __typename
        ... on Document {
          meta {
            title
            path
            kind
            template
            description
            credits
          }
        }
        ... on Comment {
          content
          createdAt
          displayAuthor {
            profilePicture
            name
            credential {
              description
              verified
            }
          }
          published
          updatedAt
        }
        ... on User {
          id
          username
          firstName
          lastName
          credentials {
            verified
            description
            isListed
          }
          hasPublicProfile
        }
      }
      highlights
      score
    }
  }
}
`

class Results extends Component {
  constructor (props, ...args) {
    super(props, ...args)

    this.state = {
      storedAggregations: null
    }
  }

  componentWillReceiveProps (props) {
    if (!props.data) return

    // We gotta remember the original buckets before a filter is applied,
    // otherwise we'd just end up with the buckets returned by the filter.
    if (!props.data.loading &&
        !props.data.error &&
        props.filters.length === 0 &&
        props.data.search) {
      this.setState({storedAggregations: props.data.search.aggregations})
    }
  }

  render () {
    const { t, sort, onSortClick, filters, onFilterClick, data } = this.props

    if (!data) {
      return null
    }

    const sortKey = sort.key
    const sortDirection = sort.direction

    const timeagoFromNow = (createdAtString) => {
      return timeago(t, (new Date() - Date.parse(createdAtString)) / 1000)
    }

    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          const { data } = this.props
          const { search } = data

          console.log(search)

          if (!search) {
            return null
          }
          const { nodes, totalCount } = search

          if (!totalCount) {
            return <P>Keine Ergebnisse</P>
          }

          const aggregations = this.state.storedAggregations
            ? this.state.storedAggregations
            : search.aggregations

          // TODO: Add text length buckets when available.
          const templateFilter = filters.find(filter => filter.key === 'template')
          const typeFilter = filters.find(filter => filter.key === 'type')

          const templateAggregations = aggregations.find(
            agg => agg.key === 'template'
          )
          const typeAggregations = aggregations.find(
            agg => agg.key === 'type'
          )

          const templateFilters = templateAggregations && templateAggregations.buckets
            .filter(bucket => bucket.value !== 'front')
            .map(bucket => {
              return {
                key: bucket.value,
                label: bucket.value, // TODO: Backend should return labels.
                count: bucket.count,
                selected: !!templateFilter && templateFilter.value === bucket.value
              }
            })
          const typeFilters = typeAggregations && typeAggregations.buckets
            .filter(bucket => bucket.value !== 'Document')
            .map(bucket => {
              return {
                key: bucket.value,
                label: bucket.value, // TODO: Backend should return labels.
                count: bucket.count,
                selected: !!typeFilter && typeFilter.value === bucket.value
              }
            })

          return (
            <div {...styles.container}>
              <Filter filterBucketKey='template' filters={templateFilters} onClickHander={onFilterClick} />
              <Filter filterBucketKey='type' filters={typeFilters} onClickHander={onFilterClick} />
              <Sort
                selectedKey={sortKey}
                direction={sortDirection}
                onClickHander={onSortClick}
              />
              <div {...styles.results}>
                {nodes &&
                  nodes.map((node, index) => (
                    <Fragment key={index}>
                      {node.entity.__typename === 'Document' && (
                        <TeaserFeed
                          {...node.entity.meta}
                          kind={
                            node.entity.meta.template ===
                            'editorialNewsletter' ? (
                                'meta'
                              ) : (
                                node.entity.meta.kind
                              )
                          }
                          Link={Link}
                          key={node.entity.meta.path}
                        />
                      )}
                      {node.entity.__typename === 'Comment' && (
                        <div {...styles.comment}>
                          <Comment
                            content={node.entity.content}
                            displayAuthor={node.entity.displayAuthor}
                            published={node.entity.published}
                            createdAt={node.entity.createdAt}
                            updatedAt={node.entity.updatedAt}
                            timeago={timeagoFromNow}
                            t={t}
                          />
                        </div>
                      )}
                      {node.entity.__typename === 'User' && (
                        <UserTeaser {...node.entity} />
                      )}
                    </Fragment>
                  ))}
              </div>
            </div>
          )
        }}
      />
    )
  }
}

export default compose(
  withT,
  graphql(getSearchResults, {
    skip: props => !props.searchQuery,
    options: props => ({
      variables: {
        search: props.searchQuery,
        sort: props.sort,
        filters: props.filters
      }
    })
  })
)(Results)
