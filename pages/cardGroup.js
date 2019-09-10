import React, { Fragment } from 'react'
import { withRouter } from 'next/router'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Editorial } from '@project-r/styleguide'

import withT from '../lib/withT'
import { routes } from '../lib/routes'
import {
  PUBLIC_BASE_URL
} from '../lib/constants'

import Frame from '../components/Frame'
import Meta from '../components/Frame/Meta'
import Container from '../components/Card/Container'
import Group from '../components/Card/Group'
import Loader from '../components/Loader'
import StatusError from '../components/StatusError'
import { cardFragment } from '../components/Card/fragments'
import { withEditor } from '../components/Auth/checkRoles'

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

const Page = ({ serverContext, router: { query: { group } }, isEditor, data, t }) => {
  const Wrapper = data.loading ? Container : Fragment

  return (
    <Frame footer={false} navBar={false} raw>
      <Wrapper>
        <Loader loading={data.loading} error={data.error} render={() => {
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
            })}`
            // ToDo: image
          }} />
          if (!isEditor) {
            return <Container>
              {meta}
              <div style={{ padding: 10, maxWidth: 700, margin: '40px auto 0', textAlign: 'center' }}>
                <Editorial.P>
                  <strong>{t('pages/cardGroups/comingsoon')}</strong>
                </Editorial.P>
              </div>
            </Container>
          }
          return (
            <>
              {meta}
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
      </Wrapper>
    </Frame>
  )
}

export default compose(
  withRouter,
  withT,
  withEditor,
  graphql(query, {
    options: ({ router }) => ({
      variables: {
        slug: router.query.group
      }
    })
  })
)(Page)
