import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import NotificationsSettings from '../components/Notifications/Settings'
import { enforceMembership } from '../components/Auth/withMembership'
import withT from '../lib/withT'

import { CDN_FRONTEND_BASE_URL } from '../lib/constants'

const NotificationsSettingsPage = ({ t }) => {
  const meta = {
    title: t('pages/Notifications/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Frame raw meta={meta}>
      <NotificationsSettings />
    </Frame>
  )
}

export default compose(
  enforceMembership(),
  withT
)(NotificationsSettingsPage)
