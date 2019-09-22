import React, { Fragment } from 'react'
import { withRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../lib/withT'
import withMe from '../lib/apollo/withMe'
import { routes } from '../lib/routes'
import { useDebounce } from '../lib/hooks/useDebounce'
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

const subscripedByMeQuery = gql`
query getSubscribedCardGroup($slug: String!) {
  cardGroup(slug: $slug) {
    id
    cards(first: 5000, filters: {subscribedByMe: true}) {
      totalCount
      nodes {
        id
        ...Card
        user {
          id
          subscribedByMe {
            id
            createdAt
          }
        }
      }
    }
  }
}

${cardFragment}
`

const Inner = ({ data, subscripedByMeData, t, serverContext, variables, mySmartspider }) => {
  const loading = (
    (subscripedByMeData && subscripedByMeData.loading) ||
    (data.loading && !data.cardGroup)
  )
  const Wrapper = loading ? Container : Fragment
  const error = data.error || (subscripedByMeData && subscripedByMeData.error)

  return <Wrapper>
    <Loader loading={loading} error={error} render={() => {
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
          <Group
            group={data.cardGroup}
            subscripedByMeCards={subscripedByMeData && subscripedByMeData.cardGroup.cards.nodes}
            variables={variables}
            mySmartspider={mySmartspider}
            fetchMore={({ endCursor }) => data.fetchMore({
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
  withMe,
  graphql(subscripedByMeQuery, {
    skip: props => !props.me,
    options: ({ variables: { slug } }) => ({
      variables: {
        slug
      }
    }),
    props: ({ data }) => ({
      subscripedByMeData: data
    })
  }),
  graphql(query, {
    options: ({ variables }) => ({
      variables,
      ssr: false
    })
  })
)(Inner)

const Page = ({ serverContext, router: { query: { group, top } } }) => {
  const [preferences] = useCardPreferences({})
  const [slowPreferences] = useDebounce(preferences, 500)

  return (
    <Frame footer={false} pullable={false} raw>
      <Query
        serverContext={serverContext}
        mySmartspider={slowPreferences.mySmartspider}
        variables={{
          slug: group,
          top: top ? [top] : undefined,
          mustHave: [
            slowPreferences.portrait && 'portrait',
            slowPreferences.smartspider && 'smartspider',
            slowPreferences.statement && 'statement'
          ].filter(Boolean),
          smartspider: slowPreferences.mySmartspider && slowPreferences.mySmartspiderSort
            ? slowPreferences.mySmartspider
            : undefined
        }} />
    </Frame>
  )
}

export default compose(
  withRouter
)(Page)
