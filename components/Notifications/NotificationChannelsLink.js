import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { A, fontStyles, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import { getNotificationPermission } from '../../lib/utils/notification'

const styles = {
  info: css({
    display: 'block',
    marginTop: 15,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular12
    }
  })
}

export default compose(withT)(({ t, me }) => {
  const [channels, setChannels] = useState('BASIC')

  useEffect(() => {
    if (me && me.discussionNotificationChannels) {
      const emailEnabled =
        me.discussionNotificationChannels.indexOf('EMAIL') > -1
      const browserEnabled =
        me.discussionNotificationChannels.indexOf('WEB') > -1 &&
        getNotificationPermission() === 'granted'
      const appEnabled = me.discussionNotificationChannels.indexOf('APP') > -1
      setChannels(
        (emailEnabled && browserEnabled && appEnabled && 'EMAIL_WEB_APP') ||
          (emailEnabled && browserEnabled && 'EMAIL_WEB') ||
          (emailEnabled && appEnabled && 'EMAIL_APP') ||
          (browserEnabled && appEnabled && 'WEB_APP') ||
          (emailEnabled && 'EMAIL') ||
          (appEnabled && 'APP') ||
          (browserEnabled && 'WEB') ||
          'BASIC'
      )
    }
  }, [me])
  return (
    <span {...styles.info}>
      <A href='/konto#benachrichtigungen'>
        {t(`components/Discussion/NotificationChannel/${channels}/label`)}
      </A>
    </span>
  )
})
