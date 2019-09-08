import React from 'react'
import { withRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../lib/withT'
import { Link, routes } from '../lib/routes'
import {
  PUBLIC_BASE_URL
} from '../lib/constants'

import Frame from '../components/Frame'
import Meta from '../components/Frame/Meta'
import Loader from '../components/Loader'
import Container from '../components/Card/Container'
import { Editorial } from '@project-r/styleguide'

const query = gql`
query {
  cardGroups(first: 50) {
    nodes {
      id
      slug
      name
      cards {
        totalCount
      }
    }
  }
}
`

const Page = ({ data, data: { cardGroups }, t }) => (
  <Frame raw footer={false}>
    <Container>
      <Loader loading={data.loading} error={data.error} render={() => {
        return (
          <>
            <Meta data={{
              title: t('Card/Groups/title'),
              description: t('Card/Groups/title'),
              url: `${PUBLIC_BASE_URL}${routes.find(r => r.name === 'cardGroups').toPath()}`
              // image
            }} />
            <Editorial.UL compact>
              {cardGroups.nodes.map(cardGroup => (
                <Editorial.LI key={cardGroup.id}>
                  <p>
                    <Link route='cardGroup' params={{ group: cardGroup.slug }}>
                      <Editorial.A>
                        <strong>{cardGroup.name}</strong>
                      </Editorial.A>
                    </Link><br />
                    <em>{cardGroup.cards.totalCount} Kandidaturen</em>
                  </p>
                </Editorial.LI>
              ))}
            </Editorial.UL>
          </>
        )
      }} />
    </Container>
  </Frame>
)

export default compose(
  withRouter,
  withT,
  graphql(query)
)(Page)
