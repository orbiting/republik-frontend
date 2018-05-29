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
  colors,
  labelRule,
  linkRule
} from '@project-r/styleguide'

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
  button: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  }),
  highlight: css({
    '& em': {
      background: colors.primaryBg,
      fontStyle: 'normal'
    }
  })
}

const getSearchAggregations = gql`  
query getSearchAggregations( 
    $search: String, 
    $filters: [SearchGenericFilterInput!]) { 
  search(  
      first: 1,  
      search: $search, 
      filters: $filters) {
    totalCount
    aggregations {
      key
      count
      label
      buckets {
        value
        count
        label
      }  
    }  
  }  
}  
`

// TODO: add format to document.meta once backend supports it.
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
            color
            path
            kind
            template
            description
            credits
            publishDate
          }
        }
        ... on Comment {
          id
          content
          text
          preview(length:240) {
            string
            more
          }
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
          portrait
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
  componentWillReceiveProps (props) {
    if (!props.dataAggregations || !props.dataAggregations.search) return
    const totalCount = props.dataAggregations.search.totalCount
    this.props.onTotalCountLoaded && this.props.onTotalCountLoaded(totalCount)
  }

  render () {
    const {
      t,
      data,
      dataAggregations,
      searchQuery,
      filterQuery,
      sort,
      onSearch,
      onSortClick,
      filters,
      onFilterClick,
      loadingFilters,
      onLoadMoreClick
    } = this.props

    const isFilterEnabled =
      filters &&
      !!filters.length &&
      !!filters.find(
        filter => !(filter.key === 'template' && filter.value === 'front')
      )

    const resultsOutdated = searchQuery !== filterQuery
    const opacity = resultsOutdated ? 0.6 : 1

    return (
      <div {...styles.container}>
        <Loader
          loading={dataAggregations.loading}
          error={dataAggregations.error}
          render={() => {
            const { search } = dataAggregations
            const { aggregations, totalCount } = search
            const showResults = !!searchQuery || isFilterEnabled

            if (totalCount === 0) {
              return (
                <span {...labelRule}>
                  {t('search/results/empty', { term: filterQuery })}
                </span>
              )
            }

            return (
              <Fragment>
                <Filter
                  aggregations={aggregations}
                  searchQuery={filterQuery || searchQuery}
                  filters={filters}
                  loadingFilters={loadingFilters}
                  allowCompact={showResults}
                  onClickHandler={onFilterClick}
                />
                {!resultsOutdated && showResults && totalCount > 1 && (
                  <Sort
                    sort={sort}
                    searchQuery={searchQuery}
                    isFilterEnabled={isFilterEnabled}
                    onClickHandler={onSortClick}
                  />
                )}
                {resultsOutdated && filterQuery && (
                  <div {...styles.count}>
                    <button {...styles.button} {...linkRule} onClick={onSearch}>
                      {t.pluralize('search/results', {
                        count: totalCount,
                        term: filterQuery
                      })}
                    </button>
                  </div>
                )}
              </Fragment>
            )
          }}
        />
        <Loader
          loading={data.loading}
          error={data.error}
          render={() => {
            const { data, fetchMore } = this.props
            const { search } = data

            if (!search) {
              return null
            }
            const { nodes, totalCount, pageInfo } = search

            if (!totalCount) {
              return null
            }

            return (
              <Fragment>
                {(!!searchQuery || isFilterEnabled) && (
                  <div {...styles.results} style={{ opacity }}>
                    {nodes &&
                      nodes.map((node, index) => {
                        const titleHighlight =
                          node.entity.__typename === 'Document' &&
                          node.highlights.find(
                            highlight => highlight.path === 'meta.title'
                          )
                        const descHighlight =
                          node.entity.__typename === 'Document' &&
                          node.highlights.find(
                            highlight => highlight.path === 'meta.description'
                          )
                        return (
                          <Fragment key={index}>
                            {node.entity.__typename === 'Document' && (
                              <TeaserFeed
                                {...node.entity.meta}
                                title={
                                  titleHighlight ? (
                                    <span
                                      {...styles.highlight}
                                      dangerouslySetInnerHTML={{
                                        __html: titleHighlight.fragments[0]
                                      }}
                                    />
                                  ) : (
                                    node.entity.meta.title
                                  )
                                }
                                description={
                                  descHighlight ? (
                                    <span
                                      {...styles.highlight}
                                      dangerouslySetInnerHTML={{
                                        __html: descHighlight.fragments[0]
                                      }}
                                    />
                                  ) : (
                                    node.entity.meta.description
                                  )
                                }
                                kind={
                                  node.entity.meta.template ===
                                  'editorialNewsletter' ? (
                                      'meta'
                                    ) : (
                                      node.entity.meta.kind
                                    )
                                }
                                publishDate={
                                  node.entity.meta.template ===
                                  'format' ? null : (
                                      node.entity.meta.publishDate
                                    )
                                }
                                Link={Link}
                                key={node.entity.meta.path}
                              />
                            )}
                            {node.entity.__typename === 'Comment' && (
                              <CommentTeaser
                                {...node.entity}
                                highlights={node.highlights}
                                t={t}
                              />
                            )}
                            {node.entity.__typename === 'User' && (
                              <UserTeaser {...node.entity} />
                            )}
                          </Fragment>
                        )
                      })}
                    <div {...styles.count}>
                      {nodes && nodes.length === totalCount ? (
                        t.pluralize('search/pageInfo/total', {
                          count: totalCount
                        })
                      ) : (
                        t('search/pageInfo/loadedTotal', {
                          loaded: nodes.length,
                          total: totalCount
                        })
                      )}
                      {pageInfo.hasNextPage && (
                        <button
                          {...styles.button}
                          {...linkRule}
                          onClick={() => {
                            onLoadMoreClick && onLoadMoreClick()
                            fetchMore({ after: pageInfo.endCursor })
                          }}
                        >
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
  graphql(getSearchAggregations, {
    options: props => ({
      variables: {
        search: props.filterQuery,
        filters: props.filters
      }
    }),
    props: ({ data, ownProps }) => ({
      dataAggregations: data
    })
  }),
  graphql(getSearchResults, {
    options: props => ({
      variables: {
        search: props.searchQuery,
        sort: props.sort,
        filters: props.filters
      }
    }),
    props: ({ data, ownProps }) => ({
      data,
      fetchMore: ({ after }) =>
        data.fetchMore({
          variables: {
            after,
            search: ownProps.searchQuery,
            sort: ownProps.sort,
            filters: ownProps.filters
          },
          updateQuery: (
            previousResult,
            { fetchMoreResult, queryVariables }
          ) => {
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
