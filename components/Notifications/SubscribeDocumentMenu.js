import React, { useState, useEffect } from 'react'
import { containerStyle, SubscribeIcon } from './SubscribeIcon'
import { CalloutMenu } from '@project-r/styleguide'
import SubscribeDocumentCallout from './SubscribeDocumentCallout'

const SubscribeDocumentMenu = ({ subscription, vivid, leftAligned, style }) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 5 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [animate])

  const icon = (
    <SubscribeIcon
      vivid={vivid}
      animate={animate}
      isSubscribed={subscription && subscription.active}
    />
  )

  const menu = (
    <SubscribeDocumentCallout
      subscription={subscription}
      setAnimate={setAnimate}
    />
  )

  return (
    <div {...containerStyle} style={style}>
      <CalloutMenu icon={icon} menu={menu} leftAligned={leftAligned} />
    </div>
  )
}

export default SubscribeDocumentMenu