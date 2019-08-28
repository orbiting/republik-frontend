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

const query = gql`
query {
  cardGroup(id: "c2abde51-42ee-49a5-bdb6-748bed8aecb4") {
    id
    name
    slug
    cards(first: 10) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        user {
          name
          portrait
          slug
        }
        payload
      }
    }
  }
}
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
          <Group group={data.cardGroup} />
        </>
      )
    }} />
  </Frame>
)

export default compose(
  withRouter,
  withT,
  graphql(query)
)(Page)
