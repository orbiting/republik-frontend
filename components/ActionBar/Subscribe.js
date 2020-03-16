import React from 'react'
import { css } from 'glamor'
import { styles as iconLinkStyles } from '../IconLink'
import { SubscribeIcon } from '../Notifications/SubscribeIcon'

const styles = {
  button: css({
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    margin: '0 -3px -1px 2px'
  })
}

const Subscribe = () => {
  return (
    <button {...iconLinkStyles.link} {...styles.button}>
      <SubscribeIcon isSubscribed={false} />
    </button>
  )
}

export default Subscribe
