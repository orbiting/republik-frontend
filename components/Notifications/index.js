import React from 'react'
import { Center, Interaction } from '@project-r/styleguide'
import Loader from '../Loader'
import { compose, graphql } from 'react-apollo'
import { notificationsQuery } from './enhancers'
import CommentNotification from './CommentNotification'
import StickySection from '../Feed/StickySection'
import { timeFormat } from '../../lib/utils/format'
import { nest } from 'd3-collection'

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(n => {
  return dateFormat(new Date(n.createdAt))
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

            const read = nodes.filter(n => n.readAt)
            const unread = nodes.filter(n => !n.readAt)

            return (
              <>
                <Interaction.H1 style={{ marginBottom: '40px' }}>
                  {unread.length
                    ? `${unread.length} neue Benarichtugen`
                    : 'keine neue Benachrichtigung'}
                </Interaction.H1>

                {groupByDate.entries(unread).map(({ key, values }, i, all) => {
                  return (
                    <StickySection
                      key={i}
                      hasSpaceAfter={i < all.length - 1}
                      label={key}
                    >
                      {values.map((node, j) => (
                        <CommentNotification node={node} key={j} />
                      ))}
                    </StickySection>
                  )
                })}

                {groupByDate.entries(read).map(({ key, values }, i, all) => {
                  return (
                    <StickySection
                      key={i}
                      hasSpaceAfter={i < all.length - 1}
                      label={key}
                    >
                      {values.map((node, j) => (
                        <CommentNotification read node={node} key={j} />
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
