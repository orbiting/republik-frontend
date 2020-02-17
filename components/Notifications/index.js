import React from 'react'
import { Center, Interaction } from '@project-r/styleguide'
import { compose, graphql } from 'react-apollo'
import { notificationsQuery } from './enhancers'
import CommentNotification from './CommentNotification'
import DocumentNotification from './DocumentNotification'

const Notifications = compose(graphql(notificationsQuery))(
  ({ data: { notifications } }) => {
    return (
      <Center>
        <Interaction.H1 style={{ marginBottom: '40px' }}>
          3 neue Benachrichtigungen
        </Interaction.H1>
        {notifications &&
          notifications.nodes.map((node, i) => (
            <CommentNotification node={node} key={i} />
          ))}
        <DocumentNotification />
      </Center>
    )
  }
)

export default Notifications
