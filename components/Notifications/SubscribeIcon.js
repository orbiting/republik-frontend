import React from 'react'
import { colors } from '@project-r/styleguide'
import SubIcon from 'react-icons/lib/md/notifications'
import UnsubIcon from 'react-icons/lib/md/notifications-off'

export const SubscribeIcon = ({ isSubscribed, onClick }) => {
  const Icon = isSubscribed ? SubIcon : UnsubIcon
  return (
    <div style={{ cursor: 'pointer' }} onClick={onClick}>
      <Icon size={24} fill={isSubscribed ? colors.text : colors.lightText} />
    </div>
  )
}
