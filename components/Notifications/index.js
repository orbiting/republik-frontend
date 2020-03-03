import React, { useState, useEffect } from 'react'
import { Center, colors } from '@project-r/styleguide'
import Loader from '../Loader'
import { compose, graphql } from 'react-apollo'
import { notificationsQuery, withMarkAsReadMutation } from './enhancers'
import { css } from 'glamor'
import NotificationFeed from './NotificationFeed'

export const isNewStyle = css({
  backgroundColor: colors.primaryBg
})

const Notifications = compose(
  graphql(notificationsQuery),
  withMarkAsReadMutation
)(
  ({
    data: { error, loading, notifications, fetchMore },
    markAsReadMutation
  }) => {
    const [loadedAt] = useState(new Date())

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
