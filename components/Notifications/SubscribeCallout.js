import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import {
  A,
  fontStyles,
  Radio,
  mediaQueries,
  Callout
} from '@project-r/styleguide'
import { compose } from 'react-apollo'
import { DISCUSSION_NOTIFICATION_OPTIONS } from '../Discussion/constants'
import { withDiscussionPreferences } from '../Discussion/graphql/enhancers/withDiscussionPreferences'
import { SubscribeIcon } from './SubscribeIcon'
import NotificationChannelsLink from './NotificationChannelsLink'

const styles = {
  button: css({
    marginLeft: 'auto',
    marginRight: 10,
    position: 'relative',
    lineHeight: 'initial',
    '@media print': {
      display: 'none'
    }
  }),
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

const SubscribeCallout = ({
  t,
  discussionId,
  discussionPreferences: { me, discussion },
  setDiscussionPreferences
}) => {
  const [isSubscribed, setSubscribed] = useState(false)
  const [showCallout, setCallout] = useState(false)
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
    setSubscribed(selectedValue && selectedValue !== 'NONE')
  }, [selectedValue])

  const updatePreferences = option => e => {
    e.stopPropagation(e)
    setDiscussionPreferences(undefined, undefined, option.value).then(() => {
      setSelectedValue(option.value)
    })
  }

  if (!me || !discussion || !setDiscussionPreferences) return null

  return (
    <div {...styles.button}>
      <SubscribeIcon
        isSubscribed={isSubscribed}
        onClick={e => {
          e.stopPropagation()
          setCallout(!showCallout)
        }}
      />
      <Callout expanded={showCallout} setExpanded={setCallout}>
        <div {...styles.radio}>
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
      </Callout>
    </div>
  )
}

export default compose(
  withT,
  withDiscussionPreferences
)(SubscribeCallout)
