import React, { Fragment } from 'react'

import { Interaction, linkRule } from '@project-r/styleguide'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

const { P } = Interaction

export default withT(({ t }) => (
  <Fragment>
    <P>
      {t.elements('Account/Notifications/Legacy/text', {
        link: (
          <Link key='link' route='subscriptionsSettings'>
            <a {...linkRule}>{t('Account/Notifications/Legacy/link')}</a>
          </Link>
        )
      })}
    </P>
  </Fragment>
))
