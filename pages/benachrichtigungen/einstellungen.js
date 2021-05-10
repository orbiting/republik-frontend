import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../../components/Frame'
import NotificationsSettings from '../../components/Notifications/Settings'
import SignIn from '../../components/Auth/SignIn'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { Interaction } from '@project-r/styleguide'

import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'

const NotificationsSettingsPage = ({ t, me }) => {
  const meta = {
    title: t('pages/notifications/settings/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Frame raw={!!me} meta={meta}>
      {me ? (
        <NotificationsSettings />
      ) : (
        <>
          <Interaction.H1 style={{ marginBottom: 40 }}>
            {t('Notifications/settings/title')}
          </Interaction.H1>
          <SignIn />
        </>
      )}
    </Frame>
  )
}

export default compose(withMe, withT)(NotificationsSettingsPage)
