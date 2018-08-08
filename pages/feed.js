import React from 'react'
import { compose } from 'react-apollo'
import Feed from '../components/Feed'
import { enforceMembership } from '../components/Auth/withMembership'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const FeedPage = ({ url, me, t }) => {
  const meta = {
    title: t('pages/feed/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Feed url={url} meta={meta} />
  )
}

export default compose(
  withData,
  enforceMembership,
  withMe,
  withT
)(FeedPage)
