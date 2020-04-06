import React, { Fragment } from 'react'

import { Interaction, linkRule } from '@project-r/styleguide'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

const { H2, P } = Interaction

export default withT(({ t }) => (
  <Fragment>
    <H2 style={{ marginBottom: 10 }}>{t('Account/Onboarding/title')}</H2>
    <P>
      {t.elements('Account/Onboarding/text', {
        link: (
          <Link key='link' route='onboarding'>
            <a {...linkRule}>{t('Account/Onboarding/link')}</a>
          </Link>
        )
      })}
    </P>
  </Fragment>
))
