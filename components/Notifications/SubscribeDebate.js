import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { Radio, inQuotes } from '@project-r/styleguide'
import compose from 'lodash/flowRight'
import { DISCUSSION_NOTIFICATION_OPTIONS } from '../Discussion/constants'
import { withDiscussionPreferences } from '../Discussion/graphql/enhancers/withDiscussionPreferences'

const styles = {
  radio: css({
    '& label': {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      margin: '5px 0'
    },
    '& svg': {
      width: 16,
      height: 16
    }
  })
}

export const getSelectedDiscussionPreference = data =>
  (data &&
    data.discussion &&
    data.discussion.userPreference &&
    data.discussion.userPreference.notifications) ||
  (data && data.me && data.me.defaultDiscussionNotificationOption)

const SubscribeDebate = ({
  t,
  discussionId,
  discussionPreferences,
  setDiscussionPreferences,
  setAnimate,
  style
}) => {
  const [selectedValue, setSelectedValue] = useState(undefined)

  const notificationOptions = DISCUSSION_NOTIFICATION_OPTIONS.map(option => ({
    value: option,
    text: t(`SubscribeDebate/option/${option}/label`)
  }))

  useEffect(() => {
    setSelectedValue(getSelectedDiscussionPreference(discussionPreferences))
  }, [discussionPreferences])

  const updatePreferences = option => e => {
    e.stopPropagation(e)
    setSelectedValue(option.value)
    setDiscussionPreferences(undefined, undefined, option.value).then(() => {
      setAnimate && setAnimate(true)
    })
  }

  if (
    !discussionPreferences ||
    !discussionPreferences.me ||
    !discussionPreferences.discussion ||
    !setDiscussionPreferences
  )
    return null

  return (
    <div style={style}>
      <h4>
        {t('SubscribeDebate/title', {
          debate: inQuotes(discussionPreferences.discussion.title)
        })}
      </h4>
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
    </div>
  )
}

export default compose(withT, withDiscussionPreferences)(SubscribeDebate)
