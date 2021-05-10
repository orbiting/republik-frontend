import React, { Fragment } from 'react'

import { Interaction, A } from '@project-r/styleguide'

import withT from '../../lib/withT'
import Link from 'next/link'

const { H2, P } = Interaction

export default withT(({ t }) => (
  <Fragment>
    <H2 style={{ marginBottom: 10 }}>{t('Account/Access/Campaigns/title')}</H2>
    <P>
      {t.elements('Account/Access/Legacy/text', {
        link: (
          <Link key='link' href='/teilen' passHref>
            <A>{t('Account/Access/Legacy/link')}</A>
          </Link>
        )
      })}
    </P>
  </Fragment>
))
