import React from 'react'
import { flowRight as compose } from 'lodash'
import Feed from '../components/Feed'
import { enforceMembership } from '../components/Auth/withMembership'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const FeedPage = ({ me, t }) => {
  const meta = {
    title: t('pages/feed/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }

  return <Feed meta={meta} />
}

export default compose(enforceMembership(), withMe, withT)(FeedPage)
