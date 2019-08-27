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
  userCardGroup(id: "441d029a-63d1-4af3-8560-44747963fa24") {
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
        candidate: user {
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
      if (!data.userCardGroup) {
        return (
          <StatusError
            statusCode={404}
            serverContext={serverContext} />
        )
      }
      return (
        <>
          <Meta data={{
            title: group,
            description: t('UserCard/Group/description'),
            url: `${PUBLIC_BASE_URL}${routes.find(r => r.name === 'cardGroup').toPath({
              group
            })}`
            // image
          }} />
          <Group group={data.userCardGroup} />
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
