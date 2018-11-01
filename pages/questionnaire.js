import React from 'react'
import Page from '../components/Questionnaire/Page'
import { compose } from 'react-apollo'
import { enforceMembership } from '../components/Auth/withMembership'
import { CDN_FRONTEND_BASE_URL } from '../lib/constants'
import { t } from '../lib/withT'
import { Link } from '../lib/routes'

import {
  A
} from '@project-r/styleguide'

const meta = {
  title: t('questionnaire/title'),
  description: t('questionnaire/description'),
  facebookTitle: t('pages/meta/questionnaire/facebookTitle'),
  twitterTitle: t('pages/meta/questionnaire/twitterTitle'),
  facebookImage: `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/2018/facebookImage.png`,
  twitterImage: `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/2018/twitterImage.png`
}

const description = t.elements('pages/meta/questionnaire/unauthorized', {
  buyLink: (
    <Link key='pledge' route='pledge'>
      <A>{t('pages/meta/questionnaire/unauthorized/buyText')}</A>
    </Link>
  ),
  accountLink: (
    <Link key='account' route='account'>
      <A>{t('pages/meta/questionnaire/unauthorized/accountText')}</A>
    </Link>
  )
}
)

export default compose(
  enforceMembership(meta, { title: t('questionnaire/title'), description })
)(Page)
