import React from 'react'
import gql from 'graphql-tag'
import { css } from 'glamor'

import Section from '../Section'
import { Link } from '../../../lib/routes'
import withT from '../../../lib/withT'

import { Interaction, linkRule } from '@project-r/styleguide'
import SubscribeDocuments from '../../Notifications/SubscribeDocuments'
import { subInfo } from '../../Notifications/enhancers'

const { P } = Interaction

const styles = {
  p: css({
    marginBottom: 20
  })
}

const FORMATS = [
  'auf-lange-sicht',
  'briefing-aus-bern',
  'format-a',
  'entwicklungslabor'
]

const FormatInfo = `
fragment FormatInfo on Document {
  id
  meta {
    title
  }
  subscribedByMe {
    ...subInfo
  }
}
${subInfo}
`

export const fragments = {
  formats: gql`
    fragment FeaturedFormats {
      formats: {
        ${FORMATS.map(
          (f, i) =>
            `format${i}: document(path:"/format/${f}") { ...FormatInfo }`
        ).join('\n')}
      }
    }
    ${FormatInfo}
  `
}

const Subscriptions = props => {
  const { user, t } = props

  // Is ticked when at least one newsletter consent it to be found
  const isTicked = FORMATS.some(
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
