import { css } from 'glamor'
import React, { useState, useEffect } from 'react'
import { compose } from 'react-apollo'
import { colors, mediaQueries } from '@project-r/styleguide'

import withT from '../../lib/withT'

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
      top: 8,
      right: 8,
      [mediaQueries.mUp]: {
        top: 12,
        right: 12
      }
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

  return <span {...(hasUnread && styles.unreadNotifications)}></span>
})
