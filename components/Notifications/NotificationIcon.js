import { css } from 'glamor'
import React, { useState, useEffect } from 'react'
import { compose } from 'react-apollo'
import { useColorContext, mediaQueries } from '@project-r/styleguide'

import withT from '../../lib/withT'

import { notificationSubscription, withNotificationCount } from './enhancers'
import { containsUnread } from './index'
import withMe from '../../lib/apollo/withMe'

const styles = {
  unreadNotifications: css({
    display: 'inline-block',
    position: 'relative',
    width: 8,
    height: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'red',
    top: 8,
    right: 15,
    [mediaQueries.mUp]: {
      top: 12,
      right: 19
    }
  })
}

export default compose(
  withT,
  withMe,
  withNotificationCount
)(({ me, countData }) => {
  const [colorScheme] = useColorContext()
  const [hasUnread, setUnread] = useState(false)

  useEffect(() => {
    const { notifications, subscribeToMore, refetch } = countData
    if (!me || !subscribeToMore || !refetch) {
      setUnread(false)
      return
    }
    setUnread(containsUnread(notifications))
    const onVisibilityChange = () => {
      if (!document.hidden) {
        refetch()
      }
    }
    const unsubscribe = subscribeToMore({
      document: notificationSubscription,
      updateQuery: (prev = {}, { subscriptionData }) => {
        if (!subscriptionData.data || !subscriptionData.data.notification) {
          return prev
        }
        const updatedNotifications = {
          ...prev.notifications,
          nodes: [subscriptionData.data.notification].concat(
            prev.notifications.nodes
          )
        }
        const updatedData = {
          ...prev,
          notifications: updatedNotifications
        }
        setUnread(containsUnread(updatedNotifications))
        return updatedData
      }
    })
    window.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      unsubscribe()
      window.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [countData, me])

  return (
    <span
      {...(hasUnread && styles.unreadNotifications)}
      {...colorScheme.set('borderColor', 'default')}
    ></span>
  )
})
