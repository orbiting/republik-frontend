import React from 'react'
import { Center, Interaction } from '@project-r/styleguide'
import Loader from '../Loader'
import { compose, graphql } from 'react-apollo'
import { notificationsQuery } from './enhancers'
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

const Notifications = compose(graphql(notificationsQuery))(
  ({ data: { error, loading, notifications } }) => {
    return (
      <Center>
        <Loader
          error={error}
          loading={loading}
          render={() => {
            const { nodes } = notifications
            if (!nodes) return null

            nodes[0].readAt = false
            nodes[1].readAt = true
            nodes[2].readAt = false
            const unread = nodes.filter(n => !n.readAt)
            const hasUnread = unread.length

            return (
              <>
                <Interaction.H1 style={{ marginBottom: '40px' }}>
                  {hasUnread
                    ? `${unread.length} neue Benarichtigungen`
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
                          fadeIn={hasUnread && node.readAt}
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
  }
)

export default Notifications

/**/
