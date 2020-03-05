import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import {
  A,
  colors,
  fontStyles,
  Radio,
  mediaQueries
} from '@project-r/styleguide'
import { compose } from 'react-apollo'
import { DISCUSSION_NOTIFICATION_OPTIONS } from '../Discussion/constants'
import { withDiscussionPreferences } from '../Discussion/graphql/enhancers/withDiscussionPreferences'
import { SubscribeIcon } from './SubscribeIcon'
import { getNotificationPermission } from '../../lib/utils/notification'
import { HEADER_HEIGHT_MOBILE } from '../constants'

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
  calloutContainer: css({
    position: 'fixed',
    top: HEADER_HEIGHT_MOBILE,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    background: 'rgba(0,0,0,0.5)',
    [mediaQueries.mUp]: {
      position: 'absolute',
      top: 0,
      left: 'auto',
      bottom: 'auto',
      right: 0,
      background: 'none'
    }
  }),
  arrow: css({
    transform: 'rotate(-45deg)',
    background: colors.containerBg,
    borderTop: `1px solid ${colors.divider}`,
    borderRight: `1px solid ${colors.divider}`,
    width: 12,
    height: 12,
    position: 'absolute',
    top: -7,
    right: 15,
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'block'
    }
  }),
  callout: css({
    zIndex: 1,
    position: 'absolute',
    background: 'white',
    border: `1px solid ${colors.divider}`,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    [mediaQueries.mUp]: {
      right: -10,
      left: 'auto',
      bottom: 'auto',
      top: 40,
      width: 175,
      padding: 10
    },
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
  }),
  info: css({
    display: 'block',
    marginTop: 15,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular12
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
  const [channels, setChannels] = useState(undefined)

  const notificationOptions = DISCUSSION_NOTIFICATION_OPTIONS.map(option => ({
    value: option,
    text: t(`components/Discussion/Notification/dropdown/${option}/label`)
  }))

  const handleClick = () => setCallout(false)

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

  useEffect(() => {
    if (me && me.discussionNotificationChannels) {
      const emailEnabled =
        me.discussionNotificationChannels.indexOf('EMAIL') > -1
      const browserEnabled =
        me.discussionNotificationChannels.indexOf('WEB') > -1 &&
        getNotificationPermission() === 'granted'
      const appEnabled = me.discussionNotificationChannels.indexOf('APP') > -1
      setChannels(
        (emailEnabled && browserEnabled && appEnabled && 'EMAIL_WEB_APP') ||
          (emailEnabled && browserEnabled && 'EMAIL_WEB') ||
          (emailEnabled && appEnabled && 'EMAIL_APP') ||
          (browserEnabled && appEnabled && 'WEB_APP') ||
          (emailEnabled && 'EMAIL') ||
          (appEnabled && 'APP') ||
          (browserEnabled && 'WEB') ||
          'BASIC'
      )
    }
  }, [me])

  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [])

  const updatePreferences = option => e => {
    e.stopPropagation(e)
    setSelectedValue(option.value)
    setDiscussionPreferences(undefined, undefined, option.value).then(() =>
      setCallout(false)
    )
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
      {showCallout && (
        <div {...styles.calloutContainer}>
          <div
            id='notifications-callout'
            {...styles.callout}
            onClick={e => e.stopPropagation()}
          >
            <div {...styles.arrow} />
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
            <span {...styles.info}>
              <A href='/konto#benachrichtigungen'>
                {t(
                  `components/Discussion/NotificationChannel/${channels}/label`
                )}
              </A>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default compose(
  withT,
  withDiscussionPreferences
)(SubscribeCallout)
