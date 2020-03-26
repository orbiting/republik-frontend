import React, { useState, useEffect } from 'react'
import { CalloutMenu } from '@project-r/styleguide'
import { SubscribeIcon, containerStyle } from './SubscribeIcon'
import { compose, graphql } from 'react-apollo'
import { discussionPreferencesQuery } from '../Discussion/graphql/documents'
import SubscribeCallout from './SubscribeCallout'
import { withRouter } from 'next/router'
import { getSelectedDiscussionPreference } from './SubscribeDebate'

const SubscribeMenu = ({
  data,
  router,
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
    setSubscribed(getSelectedDiscussionPreference(data) !== 'NONE')
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
      <CalloutMenu
        icon={icon}
        menu={menu}
        leftAligned={leftAligned}
        open={router.query && !!router.query.mute}
      />
    </div>
  )
}

export default compose(
  graphql(discussionPreferencesQuery, {
    skip: props => !props.discussionId
  }),
  withRouter
)(SubscribeMenu)
