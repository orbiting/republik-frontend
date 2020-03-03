import React, { useState, useEffect } from 'react'
import { Center, Interaction } from '@project-r/styleguide'
import Loader from '../Loader'
import { compose, graphql } from 'react-apollo'
import { notificationsQuery, withMarkAsReadMutation } from './enhancers'
import CommentNotification from './CommentNotification'
import StickySection from '../Feed/StickySection'
import { timeFormat } from '../../lib/utils/format'
import { nest } from 'd3-collection'
import { css } from 'glamor'

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(n => {
  return dateFormat(new Date(n.createdAt))
})

const fadeIn = css.keyframes({
  from: {
    opacity: 0.3
  },
  to: {
    opacity: 1
  }
})

export const fadeInStyle = css({
  opacity: 0.3,
  animation: `1s ${fadeIn} 10s forwards`
})

const Notifications = compose(
  graphql(notificationsQuery),
  withMarkAsReadMutation
)(({ data: { error, loading, notifications }, markAsReadMutation }) => {
  const [loadedAt] = useState(new Date())

  const isUnread = node => !node.readAt
  const isNew = node => isUnread(node) || loadedAt < new Date(node.readAt)

  useEffect(() => {
    if (notifications && notifications.nodes) {
      notifications.nodes.filter(isUnread).map(n => markAsReadMutation(n.id))
    }
  }, [notifications])

  return (
    <Center>
      <Loader
        error={error}
        loading={loading}
        render={() => {
          const { nodes } = notifications
          if (!nodes) return null
          const newNodes = nodes.filter(isNew)
          return (
            <>
              <Interaction.H1 style={{ marginBottom: '40px' }}>
                {newNodes.length
                  ? `${newNodes.length} neue Benarichtigungen`
                  : 'Alles gelesen!'}
              </Interaction.H1>

              {groupByDate.entries(nodes).map(({ key, values }, i, all) => {
                return (
                  <StickySection
                    key={i}
                    hasSpaceAfter={i < all.length - 1}
                    label={key}
                  >
                    {values.map((node, j) => (
                      <CommentNotification
                        fadeIn={newNodes.length && node.readAt}
                        node={node}
                        key={j}
                      />
                    ))}
                  </StickySection>
                )
              })}
            </>
          )
        }}
      />
    </Center>
  )
})

export default Notifications

/**/
