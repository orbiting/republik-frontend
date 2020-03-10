import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import { Callout } from '@project-r/styleguide'
import { SubscribeIcon } from './SubscribeIcon'
import SubscribeDebateCallout from './SubscribeDebateCallout'

const styles = {
  button: css({
    marginLeft: 'auto',
    marginRight: 10,
    position: 'relative',
    lineHeight: 'initial',
    '@media print': {
      display: 'none'
    }
  })
}

const SubscribeDebateMenu = ({ discussionId }) => {
  const [isSubscribed, setSubscribed] = useState(false)
  const [showCallout, setCallout] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 1 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [animate])

  return (
    <div {...styles.button}>
      <SubscribeIcon
        animate={animate}
        isSubscribed={isSubscribed}
        onClick={e => {
          e.stopPropagation()
          setCallout(!showCallout)
        }}
      />
      <Callout expanded={showCallout} setExpanded={setCallout}>
        <SubscribeDebateCallout
          discussionId={discussionId}
          setSubscribed={setSubscribed}
          setAnimate={setAnimate}
        />
      </Callout>
    </div>
  )
}

export default SubscribeDebateMenu
