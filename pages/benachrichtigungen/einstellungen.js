import React from 'react'
import compose from 'lodash/flowRight'
import Frame, { MainContainer } from '../../components/Frame'
import NotificationsSettings from '../../components/Notifications/Settings'
import SignIn from '../../components/Auth/SignIn'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { Interaction } from '@project-r/styleguide'

import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import withDefaultSSR from '../../lib/hocs/withDefaultSSR'

const NotificationsSettingsPage = ({ t, me }) => {
  const meta = {
    title: t('pages/notifications/settings/title'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`
  }
  return (
    <Frame raw={!!me} meta={meta}>
      <MainContainer>
        {me ? (
          <NotificationsSettings />
        ) : (
          <>
            <Interaction.H1 style={{ margin: '48px 0' }}>
              {t('Notifications/settings/title')}
            </Interaction.H1>
            <SignIn />
          </>
        )}
      </MainContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withMe, withT)(NotificationsSettingsPage))
