import React, { useState, useEffect } from 'react'
import { containerStyle, SubscribeIcon } from './SubscribeIcon'
import { Callout } from '@project-r/styleguide'
import SubscribeDocumentCallout from './SubscribeDocumentCallout'

const SubscribeDocumentMenu = ({ subscription, format, vivid, styles }) => {
  const [showCallout, setCallout] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 5 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [animate])

  return (
    <div {...containerStyle} style={styles}>
      <SubscribeIcon
        vivid={vivid}
        animate={animate}
        isSubscribed={subscription && subscription.active}
        onClick={e => {
          e.stopPropagation()
          setCallout(!showCallout)
        }}
      />
      <Callout expanded={showCallout} setExpanded={setCallout}>
        <SubscribeDocumentCallout
          subscription={subscription}
          format={format}
          setAnimate={setAnimate}
        />
      </Callout>
    </div>
  )
}

export default SubscribeDocumentMenu
