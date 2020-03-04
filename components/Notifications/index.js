import React, { useState, useEffect } from 'react'
import { Center, colors } from '@project-r/styleguide'
import Loader from '../Loader'
import { compose, graphql } from 'react-apollo'
import {
  notificationsQuery,
  withMarkAsReadMutation,
  withNotificationCount
} from './enhancers'
import { css } from 'glamor'
import NotificationFeed from './NotificationFeed'

export const isNewStyle = css({
  backgroundColor: colors.primaryBg
})

export const containsUnread = notifications =>
  notifications &&
  notifications.nodes &&
  notifications.nodes.filter(n => !n.readAt).length

const Notifications = compose(
  graphql(notificationsQuery),
  withMarkAsReadMutation,
  withNotificationCount
)(
  ({
    data: { error, loading, notifications, fetchMore, refetch },
    countData,
    markAsReadMutation
  }) => {
    const [loadedAt] = useState(new Date())
    const shouldReload = containsUnread(countData.notifications)

    useEffect(() => {
      if (notifications && notifications.nodes) {
        notifications.nodes
          .filter(n => !n.readAt)
          .map(n => markAsReadMutation(n.id))
      }
    }, [notifications])

    return (
      <Center>
        <Loader
          error={error}
          loading={loading}
          render={() =>
            notifications ? (
              <NotificationFeed
                shouldReload={shouldReload}
                onReload={refetch}
                notifications={notifications}
                loadedAt={loadedAt}
                fetchMore={fetchMore}
              />
            ) : null
          }
        />
      </Center>
    )
  }
)

export default Notifications

/**/
