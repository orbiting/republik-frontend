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
import Loader from '../components/Loader'
import StatusError from '../components/StatusError'

import { cardFragment } from '../components/Card/fragments'

const query = gql`
query getCard($slug: String!) {
  user(slug: $slug) {
    id
    cards(first: 1) {
      nodes {
        id
        ...Card
        group {
          id
          name
          slug
        }
      }
    }
  }
}

${cardFragment}
`

const Page = ({ serverContext, data, t }) => (
  <Frame>
    <Loader loading={data.loading} error={data.error} render={() => {
      if (!data.user || !data.user.cards.nodes.length) {
        return (
          <StatusError
            statusCode={404}
            serverContext={serverContext} />
        )
      }
      const card = data.user.cards.nodes[0]
      return (
        <>
          <Meta data={{
            title: card.user.name,
            description: t('Card/description'),
            url: `${PUBLIC_BASE_URL}${routes.find(r => r.name === 'card').toPath({
              slug: card.user.slug
            })}`
            // image
          }} />
          {card.user.name}
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
        slug: router.query.slug
      }
    })
  })
)(Page)
