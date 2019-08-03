import React from 'react'
import gql from 'graphql-tag'
import { css } from 'glamor'

import Section from '../Section'
import NewsletterSubscriptions from '../../Account/NewsletterSubscriptions'

import { Interaction } from '@project-r/styleguide'

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

export default (props) => {
  const { user } = props

  // Is ticked when at least one newsletter consent it to be found
  const hasConsented = NEWSLETTERS.some(n => user && !!user[n])

  return (
    <Section
      heading='Newsletter'
      isTicked={hasConsented}
      {...props}>
      <P {...styles.p}>Mit den verschiedenen E-Mail-Newslettern halten wir Sie mit einem täglichen Update und einem Wochenrückblick auf dem Laufenden.</P>
      <NewsletterSubscriptions />
      <P>Diese Einstellungen lassen sich im Konto anpassen.</P>
    </Section>
  )
}
