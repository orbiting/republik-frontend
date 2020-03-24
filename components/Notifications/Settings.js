import React from 'react'
import {
  Interaction,
  Center,
  linkRule,
  A,
  mediaQueries
} from '@project-r/styleguide'
import SubscribeDocuments from './SubscribeDocuments'
import NotificationOptions from './NotificationOptions'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'

const { H1, H2 } = Interaction

const styles = {
  container: css({
    paddingTop: 15,
    [mediaQueries.mUp]: {
      paddingTop: 40
    }
  }),
  section: css({
    marginBottom: 80
  })
}

export default compose(withT)(({ t }) => {
  return (
    <>
      <Center {...styles.container}>
        <H1 style={{ marginBottom: 40 }}>
          {t('Notifications/settings/title')}
        </H1>

        <section {...styles.section}>
          <Interaction.H2>{t('Notifications/settings/formats')}</Interaction.H2>
          <SubscribeDocuments />
        </section>

        <section {...styles.section}>
          <H2>{t('account/notificationOptions/title')}</H2>
          <NotificationOptions />
        </section>

        <section {...styles.section}>
          <H2>{t('account/newsletterSubscriptions/title')}</H2>
          <p>
            {t.elements('Notifications/settings/newsletter', {
              link: (
                <A href='/konto#newsletter' {...linkRule}>
                  {t('Notifications/settings/newsletter/link')}
                </A>
              )
            })}
          </p>
        </section>
      </Center>
    </>
  )
})
