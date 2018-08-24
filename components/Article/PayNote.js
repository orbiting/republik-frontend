import React from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { WithoutMembership } from '../Auth/withMembership'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'
import { countFormat } from '../../lib/utils/format'
import withInNativeApp from '../../lib/withInNativeApp'

import {
  Container,
  Interaction,
  linkRule
} from '@project-r/styleguide'

import Box from '../Frame/Box'

const WithoutMembershipBox = ({children, style}) => (
  <WithoutMembership render={() => (
    <Box>
      <Container>
        {children}
      </Container>
    </Box>
  )} />
)

const query = gql`
query payNoteMembershipStats {
  memberStats {
    count
  }
}
`

export const Before = compose(
  withT,
  graphql(query),
  withInNativeApp
)(({ t, data: { memberStats }, inNativeIOSApp }) => (
  <WithoutMembershipBox>
    <Interaction.P>
      {t.elements(`article/payNote/before${inNativeIOSApp ? '/ios' : ''}`, {
        buyLink: (
          <Link key='buy' route='pledge'>
            <a {...linkRule}>{t('article/payNote/before/buyText')}</a>
          </Link>
        ),
        count: <span style={{whiteSpace: 'nowrap'}} key='count'>{countFormat(
          (memberStats && memberStats.count) || 18000
        )}</span>
      })}
    </Interaction.P>
  </WithoutMembershipBox>
))

export const After = compose(
  withT,
  withInNativeApp
)(({ t, isSeries, inNativeIOSApp }) => (
  <WithoutMembershipBox>
    <Interaction.P>
      {t.elements(`article/payNote/after${inNativeIOSApp ? '/ios' : ''}`, {
        buyLink: (
          <Link key='buy' route='pledge'>
            <a {...linkRule}>{t('article/payNote/after/buyText')}</a>
          </Link>
        )
      })}
    </Interaction.P>
    {!inNativeIOSApp && isSeries && <Interaction.P style={{marginTop: 15}}>
      {t('article/payNote/after/series')}
    </Interaction.P>}
  </WithoutMembershipBox>
))
