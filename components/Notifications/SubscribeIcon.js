import React from 'react'
import { useColorContext } from '@project-r/styleguide'
import { MdNotifications, MdNotificationsNone } from 'react-icons/md'
import { css } from 'glamor'

const styles = {
  icon: css({
    '@media(hover)': {
      '&:hover': {
        opacity: 0.6
      }
    }
  }),
  animate: css({
    opacity: 0,
    animation: `${css.keyframes({
      '0%': { opacity: 0 },
      '100%': { opacity: 1 }
    })} 0.5s cubic-bezier(0.6, 0, 0.6, 1) forwards`
  })
}

const SubscribeIcon = ({ isSubscribed, animate }) => {
  const [colorScheme] = useColorContext()
  const Icon = isSubscribed ? MdNotifications : MdNotificationsNone
  return (
    <Icon
      {...styles.icon}
      {...(animate && styles.animate)}
      size={24}
      fill={colorScheme.text}
    />
  )
}

export default SubscribeIcon
