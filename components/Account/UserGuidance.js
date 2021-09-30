import React from 'react'
import compose from 'lodash/flowRight'
import { css } from 'glamor'

import withT from '../../lib/withT'
import withInNativeApp from '../../lib/withInNativeApp'

import { withSignOut } from '../Auth/SignOut'
import Box from '../Frame/Box'
import { MainContainer } from '../Frame'
import { P } from './Elements'

import { Interaction, Editorial } from '@project-r/styleguide'
import Link from 'next/link'

const styles = {
  list: css({
    '& li + li': {
      marginTop: 10
    }
  })
}

const ISSUES = [
  { issue: 1 },
  { issue: 2, hideInNativeIOSApp: true },
  { issue: 3, hideInNativeIOSApp: true },
  { issue: 4, hideInNativeIOSApp: true },
  { issue: 5 }
]

const UserGuidance = ({ t, inNativeIOSApp, signOut }) => (
  <Box>
    <MainContainer>
      <Interaction.P>{t('Account/noActiveMembership/before')}</Interaction.P>
      <ul {...styles.list}>
        {ISSUES.map(({ issue, hideInNativeIOSApp = false }) => {
          if (inNativeIOSApp && hideInNativeIOSApp) {
            return null
          }

          return (
            <li key={issue}>
              <P>
                {t(`Account/noActiveMembership/issue${issue}`)}
                <br />
                {t.elements(`Account/noActiveMembership/solution${issue}`, {
                  solution: (
                    <b key='solution'>
                      {t('Account/noActiveMembership/solution')}
                    </b>
                  ),
                  signOutLink: (
                    <Editorial.A
                      key='signOut'
                      href='#abmelden'
                      onClick={e => {
                        e.preventDefault()
                        signOut()
                      }}
                    >
                      {t('Account/noActiveMembership/signOutLink')}
                    </Editorial.A>
                  ),
                  membershipsLink: (
                    <Editorial.A key='account-memberships' href='/konto#abos'>
                      {t('Account/noActiveMembership/membershipsLink')}
                    </Editorial.A>
                  ),
                  pledgeLink: (
                    <Link href='/angebote' key='pledge' passHref>
                      <Editorial.A>
                        {t('Account/noActiveMembership/pledgeLink')}
                      </Editorial.A>
                    </Link>
                  ),
                  claimLink: (
                    <Link href='/abholen' key='claim' passHref>
                      <Editorial.A>
                        {t('Account/noActiveMembership/claimLink')}
                      </Editorial.A>
                    </Link>
                  )
                })}
              </P>
            </li>
          )
        })}
      </ul>
      <Interaction.P>{t('Account/noActiveMembership/after')}</Interaction.P>
    </MainContainer>
  </Box>
)

export default compose(withT, withInNativeApp, withSignOut)(UserGuidance)
