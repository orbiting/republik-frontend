import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'
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
query getSearchResults($search: String, $sortKey: SearchSortKey!) {
  search(first: 300, search: $search, sort: {key: $sortKey}, filters: []) {
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
          displayAuthor {
            profilePicture
            name
            credential {
              description
              verified
            }
          }
          published
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
  render () {
    const { t, sortKey, sortDirection, onSortClick, data } = this.props

    if (!data) {
      return null
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

          // TODO: Add text length buckets when available and make
          // filters within one bucket mutually exclusive.
          const templateAggregations = search.aggregations.find(
            agg => agg.key === 'template'
          )

          const filters = templateAggregations.buckets.map(bucket => {
            return {
              key: bucket.value,
              label: bucket.value, // TODO: Backend should return labels.
              count: bucket.count
            }
          })

          return (
            <div {...styles.container}>
              <Filter filters={filters} />
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
        sortKey: props.sortKey
      }
    })
  })
)(Results)
