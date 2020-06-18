import { css, merge } from 'glamor'
import { MdNotifications, MdNotificationsNone } from 'react-icons/md'
import React, { useState, useEffect } from 'react'
import { compose } from 'react-apollo'

import { colors, mediaQueries } from '@project-r/styleguide'

import HeaderIconA from '../Frame/HeaderIconA'
import { HEADER_ICON_SIZE } from '../constants'

import withT from '../../lib/withT'
import { Link } from '../../lib/routes'

import { notificationSubscription, withNotificationCount } from './enhancers'
import { containsUnread } from './index'

const styles = {
  unreadNotifications: css({
    display: 'inline-block',
    position: 'relative',
    '&:after': {
      content: ' ',
      width: 8,
      height: 8,
      borderRadius: 8,
      border: `1px solid ${colors.containerBg}`,
      background: 'red',
      position: 'absolute',
      top: 2,
      right: 2
    }
  })
}

export default compose(
  withT,
  withNotificationCount
)(({ t, countData: { notifications, subscribeToMore, refetch }, fill }) => {
  const [hasUnread, setUnread] = useState(containsUnread(notifications))
  const subscribe = () =>
    subscribeToMore({
      document: notificationSubscription,
      updateQuery: (prev = {}, { subscriptionData }) => {
        if (!subscriptionData.data || !subscriptionData.data.notification) {
          return prev
        }
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            nodes: [subscriptionData.data.notification].concat(
              prev.notifications.nodes
            )
          }
        }
      }
    })

  useEffect(() => {
    setUnread(containsUnread(notifications))
    const unsubscribe = subscribe()
    return () => unsubscribe()
  }, [notifications])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (!document.hidden) {
        refetch()
      }
    }
    window.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [refetch])

  const Icon = hasUnread ? MdNotifications : MdNotificationsNone

  return (
    <Link route='subscriptions' passHref>
      <HeaderIconA title={t('header/nav/notifications/aria')}>
        <span {...(hasUnread && styles.unreadNotifications)}>
          <Icon fill={fill} size={HEADER_ICON_SIZE} />
        </span>
      </HeaderIconA>
    </Link>
  )
})
