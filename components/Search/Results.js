import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { css } from 'glamor'
import gql from 'graphql-tag'

import withT from '../../lib/withT'

import Loader from '../../components/Loader'
import Link from '../Link/Href'

import Filter from './Filter'
import Sort from './Sort'
import CommentTeaser from './CommentTeaser'
import UserTeaser from './UserTeaser'

import {
  TeaserFeed,
  Interaction,
  colors,
  linkRule
} from '@project-r/styleguide'

const { P } = Interaction

const styles = {
  container: css({
    paddingTop: 0
  }),
  results: css({
    paddingTop: 60
  }),
  count: css({
    borderTop: `1px solid ${colors.text}`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    textAlign: 'left'
  }),
  loadMore: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  })
}

const getSearchResults = gql`
query getSearchResults(
    $search: String,
    $after: String,
    $sort: SearchSortInput,
    $filters: [SearchGenericFilterInput!]) {
  search(
      first: 100,
      after: $after,
      search: $search,
      sort: $sort,
      filters: $filters) {
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
          id
          content
          text
          createdAt
          displayAuthor {
            id
            name
            username
            profilePicture
            credential {
              description
              verified
            }
          }
          published
          updatedAt
          discussion {
            id
            title
            documentPath
          }
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
      highlights {
        path
        fragments
      }
      score
    }
  }
}
`

class Results extends Component {
  render () {
    const { t, searchQuery, sort, onSortClick, filters, onFilterClick, data } = this.props

    if (!data) {
      return null
    }

    const sortKey = sort ? sort.key : 'publishedAt'
    const sortButtons = [
      {
        sortKey: 'publishedAt',
        label: 'Zeit',
        direction: sortKey === 'publishedAt' && sort.direction ? sort.direction : 'DESC',
        disabled: !searchQuery && !filters.length,
        selected: sortKey === 'publishedAt'
      },
      {
        sortKey: 'relevance',
        label: 'Relevanz',
        disabled: !searchQuery,
        selected: sortKey === 'relevance'

      }
      // TODO: enable these sort keys once backend supports them.
      /*
      {
        sortKey: 'mostRead',
        label: 'meistgelesen'
      },
      {
        sortKey: 'mostDebated',
        label: 'meistdebattiert'
      } */
    ]

    const resultsEmpty = data && data.search && data.search.totalCount === 0

    return (
      <div {...styles.container}>
        {!resultsEmpty && (
          <Fragment>
            <Filter searchQuery={searchQuery} filters={filters} onFilterClick={onFilterClick} />
            <Sort
              buttons={sortButtons}
              onClickHander={onSortClick}
            />
          </Fragment>
        )}
        <Loader
          loading={data.loading}
          error={data.error}
          render={() => {
            const { data, fetchMore } = this.props
            const { search } = data

            console.log(search)

            if (!search) {
              return null
            }
            const { nodes, totalCount, pageInfo } = search

            if (!totalCount) {
              return <P>Keine Ergebnisse</P>
            }

            return (
              <Fragment>
                {(!!searchQuery || !!filters.length) && (
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
                          <CommentTeaser
                            id={node.entity.id}
                            discussion={node.entity.discussion}
                            content={node.entity.content}
                            text={node.entity.text}
                            highlights={node.highlights}
                            displayAuthor={node.entity.displayAuthor}
                            published={node.entity.published}
                            createdAt={node.entity.createdAt}
                            updatedAt={node.entity.updatedAt}
                            t={t}
                          />
                        )}
                        {node.entity.__typename === 'User' && (
                          <UserTeaser {...node.entity} />
                        )}
                      </Fragment>
                    ))}
                    <div {...styles.count}>
                      {nodes.length === totalCount
                        ? t.pluralize('search/pageInfo/total', {count: totalCount})
                        : t('search/pageInfo/loadedTotal', {
                          loaded: nodes.length,
                          total: totalCount
                        })
                      }
                      {pageInfo.hasNextPage && (
                        <button {...styles.loadMore} {...linkRule} onClick={() => {
                          fetchMore({after: pageInfo.endCursor})
                        }}>
                          {t('search/pageInfo/loadMore')}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Fragment>
            )
          }}
        />
      </div>
    )
  }
}

export default compose(
  withT,
  graphql(getSearchResults, {
    // skip: props => !props.searchQuery,
    options: props => ({
      variables: {
        search: props.searchQuery,
        sort: props.sort,
        filters: props.filters
      }
    }),
    props: ({data, ownProps}) => ({
      data,
      fetchMore: ({after}) => data.fetchMore({
        variables: {
          after,
          search: ownProps.searchQuery,
          sort: ownProps.sort,
          filters: ownProps.filters
        },
        updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
          const nodes = [
            ...previousResult.search.nodes,
            ...fetchMoreResult.search.nodes
          ]
          return {
            ...previousResult,
            totalCount: fetchMoreResult.search.pageInfo.hasNextPage
              ? fetchMoreResult.search.totalCount
              : nodes.length,
            search: {
              ...previousResult.search,
              ...fetchMoreResult.search,
              nodes
            }
          }
        }
      })
    })
  })
)(Results)
