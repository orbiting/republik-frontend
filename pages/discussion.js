import React from 'react'
import Page from '../components/Feedback/Page'
import { compose } from 'react-apollo'
import { enforceMembership } from '../components/Auth/withMembership'
import { CDN_FRONTEND_BASE_URL, PUBLIC_BASE_URL } from '../lib/constants'
import { t } from '../lib/withT'
import { Link } from '../lib/routes'

import {
  A
} from '@project-r/styleguide'

const meta = {
  pageTitle: t('pages/index/pageTitle'),
  title: t('pages/index/title'),
  description: t('pages/index/description'),
  image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
  url: `${PUBLIC_BASE_URL}/`
}

const description = t.elements('withMembership/signIn/note', {
  buyLink: (
    <Link key='pledge' route='pledge'>
      <A>{t('withMembership/signIn/note/buyText')}</A>
    </Link>
  )
})

export default compose(
  enforceMembership(meta, { title: t('withMembership/title'), description })
)(Page)
