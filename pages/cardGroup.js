import React from 'react'
import { withRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../lib/withT'
import { routes } from '../lib/routes'
import {
  PUBLIC_BASE_URL
} from '../lib/constants'

import Frame from '../components/Frame'
import Meta from '../components/Frame/Meta'
import Group from '../components/Card/Group'
import Loader from '../components/Loader'
import StatusError from '../components/StatusError'
import { cardFragment } from '../components/Card/fragments'

const query = gql`
query getCardGroup($slug: String!, $after: String) {
  cardGroup(slug: $slug) {
    id
    name
    slug
    cards(first: 50, after: $after) {
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

const Page = ({ serverContext, router: { query: { group } }, data, t }) => (
  <Frame raw>
    <Loader loading={data.loading} error={data.error} render={() => {
      if (!data.cardGroup) {
        return (
          <StatusError
            statusCode={404}
            serverContext={serverContext} />
        )
      }
      return (
        <>
          <Meta data={{
            title: data.cardGroup.name,
            description: t('UserCard/Group/description'),
            url: `${PUBLIC_BASE_URL}${routes.find(r => r.name === 'cardGroup').toPath({
              group
            })}`
            // image
          }} />
          <Group group={data.cardGroup} fetchMore={({ endCursor }) => data.fetchMore({
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
  </Frame>
)

export default compose(
  withRouter,
  withT,
  graphql(query, {
    options: ({ router }) => ({
      variables: {
        slug: router.query.group
      }
    })
  })
)(Page)
