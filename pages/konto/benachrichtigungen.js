import React from 'react'
import compose from 'lodash/flowRight'
import Frame from '../../components/Frame'
import NotificationsSettings from '../../components/Notifications/Settings'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { AccountEnforceMe } from '../../components/Account/Elements'

import withDefaultSSR from '../../lib/hocs/withDefaultSSR'

const NotificationsSettingsPage = ({ t, me }) => {
  return (
    <Frame
      meta={{
        title: t('pages/account/notifications/title')
      }}
    >
      <AccountEnforceMe>
        <NotificationsSettings />
      </AccountEnforceMe>
    </Frame>
  )
}

export default withDefaultSSR(compose(withMe, withT)(NotificationsSettingsPage))
