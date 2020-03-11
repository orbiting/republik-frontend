import React from 'react'
import gql from 'graphql-tag'
import { css } from 'glamor'

import Section from '../Section'
import { Link } from '../../../lib/routes'
import withT from '../../../lib/withT'

import { Interaction, linkRule } from '@project-r/styleguide'
import SubscribeDocuments from '../../Notifications/SubscribeDocuments'

const { P } = Interaction

const styles = {
  p: css({
    marginBottom: 20
  })
}

const NEWSLETTERS = [
  'NEWSLETTER_DAILY',
  'NEWSLETTER_WEEKLY',
  'NEWSLETTER_PROJECTR'
]

export const fragments = {
  user: gql`
    fragment NewsletterUser on User {
      id
      ${NEWSLETTERS.map(n => `${n}: hasConsentedTo(name:"${n}")`).join('\n')}
    }
  `
}

const Subscriptions = props => {
  const { user, t } = props

  // Is ticked when at least one newsletter consent it to be found
  const isTicked = NEWSLETTERS.some(
    n => user && user[n] !== null && user[n] !== undefined
  )

  return (
    <Section heading='Subscriptions' isTicked={isTicked} {...props}>
      <P {...styles.p}>{t('Onboarding/Sections/Newsletter/preamble')}</P>
      <SubscribeDocuments />
      <P {...styles.p}>
        {t.elements('Onboarding/Sections/Newsletter/hint', {
          link: (
            <Link key='account' route='account' passHref>
              <a {...linkRule}>
                {t('Onboarding/Sections/Newsletter/hint/link')}
              </a>
            </Link>
          )
        })}
      </P>
    </Section>
  )
}

export default withT(Subscriptions)
