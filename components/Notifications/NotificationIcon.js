import { css, merge } from 'glamor'
import Notifications from 'react-icons/lib/md/notifications-none'
import React from 'react'
import { menuIconStyle } from '../Frame/Header'
import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  ICON_BUTTON_WIDTH
} from '../constants'
import { colors, mediaQueries } from '@project-r/styleguide'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'
import { withNotificationCount } from './enhancers'

const styles = {
  notifications: css({
    right: HEADER_HEIGHT_MOBILE + ICON_BUTTON_WIDTH,
    [mediaQueries.mUp]: {
      right: HEADER_HEIGHT + ICON_BUTTON_WIDTH + 5
    }
  }),
  unreadNotifications: css({
    '&:after': {
      content: ' ',
      width: 8,
      height: 8,
      borderRadius: 8,
      border: `1px solid ${colors.containerBg}`,
      background: 'red',
      position: 'absolute',
      top: (HEADER_HEIGHT_MOBILE - ICON_BUTTON_WIDTH) / 2 + 1,
      right: 2,
      [mediaQueries.mUp]: {
        top: (HEADER_HEIGHT - ICON_BUTTON_WIDTH) / 2 + 2,
        right: 15
      }
    }
  })
}

export default compose(
  withT,
  withNotificationCount
)(({ t, data: { notifications }, fill }) => {
  const hasUnread =
    notifications &&
    notifications.nodes &&
    notifications.nodes.filter(n => !n.readAt).length
  return (
    <a
      {...merge(
        menuIconStyle,
        styles.notifications,
        hasUnread && styles.unreadNotifications
      )}
      title={t('header/nav/notifications/aria')}
      href='/benachrichtigungen'
    >
      <Notifications fill={fill} size={ICON_BUTTON_WIDTH - 1} />
    </a>
  )
})
