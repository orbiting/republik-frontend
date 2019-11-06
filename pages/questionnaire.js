import React from 'react'
import Page from '../components/Questionnaire/Page'
import { compose } from 'react-apollo'
import { enforceMembership } from '../components/Auth/withMembership'
import { CDN_FRONTEND_BASE_URL } from '../lib/constants'
import { t } from '../lib/withT'
import { Link } from '../lib/routes'

import { A } from '@project-r/styleguide'

const meta = {
  title: t('questionnaire/title'),
  description: t('questionnaire/description'),
  facebookTitle: t('pages/meta/questionnaire/socialTitle'),
  facebookDescription: t('pages/meta/questionnaire/socialDescription'),
  twitterTitle: t('pages/meta/questionnaire/socialTitle'),
  twitterDescription: t('pages/meta/questionnaire/socialDescription'),
  facebookImage: `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/2018/facebookImage.png`,
  twitterImage: `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/2018/twitterImage.png`
}

const description = t.elements('pages/meta/questionnaire/unauthorized', {
  buyLink: (
    <Link key='pledge' route='pledge'>
      <A>{t('pages/meta/questionnaire/unauthorized/buyText')}</A>
    </Link>
  )
})

export default compose(
  enforceMembership(meta, { title: t('questionnaire/title'), description })
)(Page)
