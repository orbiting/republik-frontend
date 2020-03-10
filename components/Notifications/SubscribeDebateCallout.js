import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { fontStyles, Radio, mediaQueries, colors } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import { DISCUSSION_NOTIFICATION_OPTIONS } from '../Discussion/constants'
import { withDiscussionPreferences } from '../Discussion/graphql/enhancers/withDiscussionPreferences'
import NotificationChannelsLink from './NotificationChannelsLink'
import SubscribeCalloutTitle from './SubscribeCalloutTitle'

const styles = {
  radio: css({
    '& label': {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      margin: '5px 0',
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular12
      }
    },
    '& svg': {
      width: 16,
      height: 16
    }
  })
}

const SubscribeDebateCallout = ({
  t,
  discussionId,
  discussionPreferences: { me, discussion },
  setDiscussionPreferences,
  setSubscribed,
  setAnimate,
  showTitle
}) => {
  const [selectedValue, setSelectedValue] = useState(undefined)

  const notificationOptions = DISCUSSION_NOTIFICATION_OPTIONS.map(option => ({
    value: option,
    text: t(`components/Discussion/Notification/dropdown/${option}/label`)
  }))

  useEffect(() => {
    setSelectedValue(
      (discussion &&
        discussion.userPreference &&
        discussion.userPreference.notifications) ||
        (me && me.defaultDiscussionNotificationOption)
    )
  }, [discussion, me])

  useEffect(() => {
    setSubscribed && setSubscribed(selectedValue && selectedValue !== 'NONE')
  }, [selectedValue])

  const updatePreferences = option => e => {
    e.stopPropagation(e)
    setDiscussionPreferences(undefined, undefined, option.value).then(() => {
      setSelectedValue(option.value)
      setAnimate && setAnimate(true)
    })
  }

  if (!me || !discussion || !setDiscussionPreferences) return null

  return (
    <>
      <div {...styles.radio}>
        {showTitle && (
          <SubscribeCalloutTitle isSubscribed={selectedValue !== 'NONE'} />
        )}
        {notificationOptions.map(option => (
          <div key={option.value}>
            <Radio
              value={option.value}
              checked={selectedValue === option.value}
              onChange={updatePreferences(option)}
            >
              <span>{option.text}</span>
            </Radio>
          </div>
        ))}
      </div>
      <NotificationChannelsLink me={me} />
    </>
  )
}

export default compose(
  withT,
  withDiscussionPreferences
)(SubscribeDebateCallout)
