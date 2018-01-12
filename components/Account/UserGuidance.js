import React from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'

import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

import { withSignOut } from '../Auth/SignOut'
import Box from '../Frame/Box'
import { MainContainer } from '../Frame'
import { P } from './Elements'

import { Interaction, linkRule } from '@project-r/styleguide'

const styles = {
  list: css({
    '& li + li': {
      marginTop: 10
    }
  })
}

const ISSUES = [1, 2, 3, 4]

const UserGuidance = ({ t, signOut }) => (
  <Box>
    <MainContainer>
      <Interaction.P>{t('Account/noActiveMembership/before')}</Interaction.P>
      <ul {...styles.list}>
        {ISSUES.map(index => (
          <li key={index}>
            <P>
              {t(`Account/noActiveMembership/issue${index}`)}
              <br />
              {t.elements(`Account/noActiveMembership/solution${index}`, {
                solution: (
                  <b key='solution'>
                    {t('Account/noActiveMembership/solution')}
                  </b>
                ),
                signOutLink: (
                  <a
                    key='signOut'
                    href='#abmelden'
                    {...linkRule}
                    onClick={e => {
                      e.preventDefault()
                      signOut()
                    }}
                  >
                    {t('Account/noActiveMembership/signOutLink')}
                  </a>
                ),
                pledgeLink: (
                  <Link route='pledge' key='pledge'>
                    <a {...linkRule}>
                      {t('Account/noActiveMembership/pledgeLink')}
                    </a>
                  </Link>
                )
              })}
            </P>
          </li>
        ))}
      </ul>
      <Interaction.P>{t('Account/noActiveMembership/after')}</Interaction.P>
    </MainContainer>
  </Box>
)

export default compose(withT, withSignOut)(UserGuidance)
