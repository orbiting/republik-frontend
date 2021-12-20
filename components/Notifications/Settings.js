import React from 'react'
import { useRouter } from 'next/router'
import { Interaction, A } from '@project-r/styleguide'
import compose from 'lodash/flowRight'
import SubscribedDocuments from './SubscribedDocuments'
import SubscribedAuthors from './SubscribedAuthors'
import NotificationOptions from './NotificationOptions'
import withT from '../../lib/withT'
import { withMembership } from '../Auth/checkRoles'
import Box from '../Frame/Box'
import Link from 'next/link'
import AccountTabs from '../../components/Account/AccountTabs'
import AccountSection from '../../components/Account/AccountSection'
import NotificationFeedMini from '../../components/Notifications/NotificationFeedMini'

export default compose(
  withT,
  withMembership
)(({ t, isMember }) => {
  const { pathname } = useRouter()

  return (
    <>
      <AccountTabs pathname={pathname} t={t} />
      {!isMember && (
        <Box style={{ margin: '10px 0', padding: 15 }}>
          <Interaction.P>
            {t('Notifications/settings/noMembership')}
          </Interaction.P>
        </Box>
      )}

      <AccountSection title='Neuste Benachrichtigungen'>
        <NotificationFeedMini />
        <br />
        <Link href='/benachrichtigungen' passHref>
          <A>{t('Notifications/settings/back')}</A>
        </Link>
      </AccountSection>

      <AccountSection title={t('Notifications/settings/discussion')}>
        <NotificationOptions />
      </AccountSection>

      <AccountSection title={t('Notifications/settings/formats')}>
        <SubscribedDocuments />
      </AccountSection>

      <AccountSection title={t('Notifications/settings/authors')}>
        <SubscribedAuthors />
      </AccountSection>
    </>
  )
})
