import React, { useState, useEffect } from 'react'
import { CalloutMenu } from '@project-r/styleguide'
import { SubscribeIcon, containerStyle } from './SubscribeIcon'
import SubscribeDebateCallout from './SubscribeDebateCallout'

const SubscribeDebateMenu = ({ discussionId }) => {
  const [isSubscribed, setSubscribed] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 1 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [animate])

  const icon = <SubscribeIcon animate={animate} isSubscribed={isSubscribed} />

  const menu = (
    <SubscribeDebateCallout
      discussionId={discussionId}
      setSubscribed={setSubscribed}
      setAnimate={setAnimate}
    />
  )

  return (
    <div {...containerStyle}>
      <CalloutMenu icon={icon} menu={menu} />
    </div>
  )
}

export default SubscribeDebateMenu
