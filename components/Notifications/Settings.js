import React from 'react'
import {
  Interaction,
  Center,
  linkRule,
  A,
  mediaQueries
} from '@project-r/styleguide'
import { compose } from 'react-apollo'
import SubscribedDocuments from './SubscribedDocuments'
import SubscribedAuthors from './SubscribedAuthors'
import NotificationOptions from './NotificationOptions'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

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

export default compose(withT)(({ t }) => {
  return (
    <>
      <Center {...styles.container}>
        <H1 style={{ marginBottom: 20 }}>
          {t('Notifications/settings/title')}
        </H1>
        <Link route='subscriptions' passHref>
          <A {...linkRule}>{t('Notifications/settings/back')}</A>
        </Link>

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
                <A key='link' href='/konto#newsletter' {...linkRule}>
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
