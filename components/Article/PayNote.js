import React from 'react'
import { WithoutMembership } from '../Auth/withMembership'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

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

export const Before = withT(({t}) => (
  <WithoutMembershipBox>
    <Interaction.P>
      {t.elements('article/payNote/before', {
        buyLink: (
          <Link route='pledge'>
            <a {...linkRule}>{t('article/payNote/before/buyText')}</a>
          </Link>
        )
      })}
    </Interaction.P>
  </WithoutMembershipBox>
))

export const After = withT(({t}) => (
  <WithoutMembershipBox>
    <Interaction.P>
      {t.elements('article/payNote/after', {
        buyLink: (
          <Link route='pledge'>
            <a {...linkRule}>{t('article/payNote/after/buyText')}</a>
          </Link>
        )
      })}
    </Interaction.P>
  </WithoutMembershipBox>
))
