import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Notifications from '../components/Notifications'
import { enforceMembership } from '../components/Auth/withMembership'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const NotificationsPage = ({ t }) => {
  const meta = {
    title: t('pages/notifications/settings/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Frame raw meta={meta}>
      <Notifications />
    </Frame>
  )
}

export default compose(
  enforceMembership(),
  withT
)(NotificationsPage)
