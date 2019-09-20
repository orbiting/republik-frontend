import React, { Fragment } from 'react'
import { withRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../lib/withT'
import { routes } from '../lib/routes'
import {
  PUBLIC_BASE_URL,
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'

import Frame from '../components/Frame'
import Meta from '../components/Frame/Meta'
import Container from '../components/Card/Container'
import Group from '../components/Card/Group'
import Loader from '../components/Loader'
import StatusError from '../components/StatusError'
import { cardFragment } from '../components/Card/fragments'
import { useCardPreferences } from '../components/Card/Preferences'

const query = gql`
query getCardGroup($slug: String!, $after: String, $top: [ID!], $mustHave: [CardFiltersMustHaveInput!], $smartspider: [Float]) {
  cardGroup(slug: $slug) {
    id
    name
    slug
    discussion {
      id
      title
    }
    all: cards(first: 0) {
      totalCount
    }
    cards(first: 50, after: $after, focus: $top, filters: {mustHave: $mustHave}, sort: {smartspider: $smartspider}) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        ...Card
      }
    }
  }
}

${cardFragment}
`

const Inner = ({ data, t, serverContext, variables }) => {
  const loading = data.loading && !data.cardGroup
  const Wrapper = loading ? Container : Fragment

  return <Wrapper>
    <Loader loading={loading} error={data.error} render={() => {
      if (!data.cardGroup) {
        return (
          <StatusError
            statusCode={404}
            serverContext={serverContext} />
        )
      }
      const meta = <Meta data={{
        title: t('pages/cardGroup/title', {
          name: data.cardGroup.name
        }),
        description: t('pages/cardGroup/description', {
          name: data.cardGroup.name,
          count: data.cardGroup.cards.totalCount
        }),
        url: `${PUBLIC_BASE_URL}${routes.find(r => r.name === 'cardGroup').toPath({
          group: data.cardGroup.slug
        })}`,
        image: `${CDN_FRONTEND_BASE_URL}/static/social-media/republik-wahltindaer-08.png`
      }} />
      return (
        <>
          {meta}
          <Group group={data.cardGroup} variables={variables} fetchMore={({ endCursor }) => data.fetchMore({
            variables: {
              after: endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              return {
                ...previousResult,
                ...fetchMoreResult,
                cardGroup: {
                  ...previousResult.cardGroup,
                  ...fetchMoreResult.cardGroup,
                  cards: {
                    ...previousResult.cardGroup.cards,
                    ...fetchMoreResult.cardGroup.cards,
                    nodes: [
                      ...previousResult.cardGroup.cards.nodes,
                      ...fetchMoreResult.cardGroup.cards.nodes
                    ].filter((value, index, all) => index === all.findIndex(other => value.id === other.id))
                  }
                }
              }
            }
          })} />
        </>
      )
    }} />
  </Wrapper>
}

const Query = compose(
  withT,
  graphql(query, {
    options: ({ variables }) => ({
      variables,
      ssr: false
    })
  })
)(Inner)

const Page = ({ serverContext, router: { query: { group, top } } }) => {
  const [preferences] = useCardPreferences({})

  return (
    <Frame footer={false} pullable={false} raw>
      <Query
        serverContext={serverContext}
        variables={{
          slug: group,
          top: top ? [top] : undefined,
          mustHave: [
            preferences.portrait && 'portrait',
            preferences.smartspider && 'smartspider',
            preferences.statement && 'statement'
          ].filter(Boolean),
          smartspider: preferences.mySmartspider && preferences.mySmartspiderSort
            ? preferences.mySmartspider
            : undefined
        }} />
    </Frame>
  )
}

export default compose(
  withRouter
)(Page)
