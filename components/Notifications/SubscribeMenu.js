import React, { useState, useEffect } from 'react'
import { CalloutMenu } from '@project-r/styleguide'
import { SubscribeIcon, containerStyle } from './SubscribeIcon'
import { compose, graphql } from 'react-apollo'
import { discussionPreferencesQuery } from '../Discussion/graphql/documents'
import SubscribeCallout from './SubscribeCallout'

const SubscribeMenu = ({
  data,
  discussionId,
  subscription,
  leftAligned,
  style
}) => {
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

  useEffect(() => {
    setSubscribed(
      (data &&
        data.discussion &&
        data.discussion.userPreference &&
        data.discussion.userPreference.notifications &&
        data.discussion.userPreference.notifications !== 'NONE') ||
        (subscription && subscription.active)
    )
  }, [data, subscription])

  const icon = <SubscribeIcon animate={animate} isSubscribed={isSubscribed} />

  const menu = (
    <SubscribeCallout
      discussionId={discussionId}
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

export default compose(
  graphql(discussionPreferencesQuery, {
    skip: props => !props.discussionId
  })
)(SubscribeMenu)
