import React, { useState, useEffect } from 'react'
import { CalloutMenu } from '@project-r/styleguide'
import { SubscribeIcon, containerStyle } from './SubscribeIcon'
import SubscribeDebateCallout from './SubscribeDebateCallout'
import { compose, graphql } from 'react-apollo'
import { discussionPreferencesQuery } from '../Discussion/graphql/documents'

const SubscribeDebateMenu = ({ discussionId, data: { discussion } }) => {
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
      discussion &&
        discussion.userPreference &&
        discussion.userPreference.notifications &&
        discussion.userPreference.notifications !== 'NONE'
    )
  }, [discussion])

  const icon = (
    <SubscribeIcon animate={animate} isSubscribed={isSubscribed} vivid />
  )

  const menu = (
    <SubscribeDebateCallout
      discussionId={discussionId}
      setAnimate={setAnimate}
    />
  )

  return (
    <div {...containerStyle}>
      <CalloutMenu icon={icon} menu={menu} leftAligned />
    </div>
  )
}

export default compose(graphql(discussionPreferencesQuery))(SubscribeDebateMenu)
