import React, { useState, useEffect } from 'react'
import { CalloutMenu } from '@project-r/styleguide'
import { SubscribeIcon, containerStyle } from './SubscribeIcon'
import SubscribeDebateCallout from './SubscribeDebateCallout'
import { compose, graphql } from 'react-apollo'
import { discussionPreferencesQuery } from '../Discussion/graphql/documents'
import SubscribeDocumentCallout from './SubscribeDocumentCallout'
import withT from '../../lib/withT'

const SubscribeDebateMenu = ({
  t,
  discussionId,
  subscription,
  data: { discussion },
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
    <>
      <SubscribeDebateCallout
        discussionId={discussionId}
        setAnimate={setAnimate}
        subtitle={subscription && t('Notifications/callout/discussion/title')}
      />
      {subscription && (
        <SubscribeDocumentCallout
          subscription={subscription}
          hideTitle
          subtitle={t('Notifications/callout/formats/title')}
        />
      )}
    </>
  )

  return (
    <div {...containerStyle} style={style}>
      <CalloutMenu icon={icon} menu={menu} leftAligned />
    </div>
  )
}

export default compose(
  withT,
  graphql(discussionPreferencesQuery)
)(SubscribeDebateMenu)
