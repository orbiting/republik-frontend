import React from 'react'
import { Interaction, Center, A, mediaQueries } from '@project-r/styleguide'
import compose from 'lodash/flowRight'
import SubscribedDocuments from './SubscribedDocuments'
import SubscribedAuthors from './SubscribedAuthors'
import NotificationOptions from './NotificationOptions'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { withMembership } from '../Auth/checkRoles'
import Box from '../Frame/Box'
import Link from 'next/link'

const { H1, H2 } = Interaction

const styles = {
  container: css({
    paddingTop: 15,
    [mediaQueries.mUp]: {
      paddingTop: 40
    }
  }),
  section: css({
    marginTop: 40,
    marginBottom: 80
  })
}

export default compose(
  withT,
  withMembership
)(({ t, isMember }) => {
  return (
    <>
      <Center {...styles.container}>
        <H1 style={{ marginBottom: 20 }}>
          {t('Notifications/settings/title')}
        </H1>
        <Link href='/benachrichtigungen' passHref>
          <A>{t('Notifications/settings/back')}</A>
        </Link>
        {!isMember && (
          <Box style={{ margin: '10px 0', padding: 15 }}>
            <Interaction.P>
              {t('Notifications/settings/noMembership')}
            </Interaction.P>
          </Box>
        )}

        <section {...styles.section}>
          <H2 style={{ marginBottom: 10 }}>
            {t('Notifications/settings/formats')}
          </H2>
          <SubscribedDocuments />
        </section>

        <section {...styles.section}>
          <H2 style={{ marginBottom: 10 }}>
            {t('Notifications/settings/authors')}
          </H2>
          <SubscribedAuthors />
        </section>

        <section {...styles.section}>
          <H2 style={{ marginBottom: 10 }}>
            {t('Notifications/settings/discussion')}
          </H2>
          <NotificationOptions />
        </section>

        <section {...styles.section}>
          <H2 style={{ marginBottom: 10 }}>
            {t('account/newsletterSubscriptions/title')}
          </H2>
          <Interaction.P>
            {t.elements('Notifications/settings/newsletter', {
              link: (
                <A key='link' href='/konto#newsletter'>
                  {t('Notifications/settings/newsletter/link')}
                </A>
              )
            })}
          </Interaction.P>
        </section>
      </Center>
    </>
  )
})
