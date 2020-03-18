import React from 'react'
import { Interaction, Center, linkRule } from '@project-r/styleguide'
import SubscribeDocuments from './SubscribeDocumentCheckbox'
import { Link } from '../../lib/routes'
import NewsletterSubscriptions from './NewsletterSubscriptions'
import NotificationOptions from './NotificationOptions'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'

const { H1, H2 } = Interaction

const styles = {
  section: css({
    marginBottom: 80
  })
}

export default compose(withT)(({ t }) => {
  return (
    <>
      <Center>
        <H1 style={{ marginBottom: 40 }}>Settings</H1>

        <section {...styles.section}>
          <Interaction.H2>Meine Formate</Interaction.H2>
          <SubscribeDocuments withCount />
          <Link route='sections' passHref>
            <a {...linkRule}>Weitere Formate entdecken und abonnieren</a>
          </Link>
        </section>

        <section {...styles.section}>
          <H2>{t('account/newsletterSubscriptions/title')}</H2>
          <NewsletterSubscriptions />
        </section>

        <section {...styles.section}>
          <H2>{t('account/notificationOptions/title')}</H2>
          <NotificationOptions />
        </section>
      </Center>
    </>
  )
})
