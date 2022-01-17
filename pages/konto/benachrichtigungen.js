import React from 'react'
import compose from 'lodash/flowRight'
import Frame from '../../components/Frame'
import NotificationsSettings from '../../components/Notifications/Settings'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { AccountPageContainer } from '../../components/Account/Elements'

import withDefaultSSR from '../../lib/hocs/withDefaultSSR'

const NotificationsSettingsPage = ({ t, me }) => {
  return (
    <Frame
      raw={!!me}
      meta={{
        title: t('pages/account/notifications/title')
      }}
    >
      <AccountPageContainer>
        <NotificationsSettings />
      </AccountPageContainer>
    </Frame>
  )
}

export default withDefaultSSR(compose(withMe, withT)(NotificationsSettingsPage))
