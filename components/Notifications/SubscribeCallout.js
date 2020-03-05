import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import { A, colors, fontStyles, Radio } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import { DISCUSSION_NOTIFICATION_OPTIONS } from '../Discussion/constants'
import { withDiscussionPreferences } from '../Discussion/graphql/enhancers/withDiscussionPreferences'
import { Router } from '../../lib/routes'
import { SubscribeIcon } from './SubscribeIcon'

const styles = {
  button: css({
    marginLeft: 'auto',
    marginRight: 10,
    position: 'relative',
    lineHeight: 'initial',
    '& span, & h3': {
      display: 'block'
    },
    '@media print': {
      display: 'none'
    }
  }),
  legend: css({
    ...fontStyles.sansSerifRegular12,
    transition: 'all 1s',
    lineHeight: 1
  }),
  callout: css({
    zIndex: 1,
    position: 'absolute',
    right: -10,
    top: 40,
    width: 175,
    background: 'white',
    border: `1px solid ${colors.divider}`,
    boxShadow: '1px 1px 10px rgba(100, 100, 100, 0.1)',
    padding: 10,
    '& label': {
      ...fontStyles.sansSerifRegular12,
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      margin: '5px 0'
    },
    '& span': {
      display: 'inline'
    },
    '& svg': {
      width: 16,
      height: 16
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
    right: 15
  }),
  link: css({
    ...fontStyles.sansSerifRegular12,
    paddingTop: 15
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
    setSelectedValue(option.value)
    setDiscussionPreferences(undefined, undefined, option.value).then(() =>
      setCallout(false)
    )
  }

  if (!me || !discussion || !setDiscussionPreferences) return null

  return (
    <div {...styles.button} id='subscribe-callout'>
      <div
        style={{ cursor: 'pointer', textAlign: 'center' }}
        onClick={() => setCallout(!showCallout)}
      >
        <SubscribeIcon isSubscribed={isSubscribed} />
        {showCallout && (
          <div {...styles.callout} onClick={e => e.stopPropagation()}>
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
            <span>
              <A {...styles.link} href='/konto#benachrichtigungen'>
                {t('components/Discussion/Notification/settings')}
              </A>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default compose(
  withT,
  withDiscussionPreferences
)(SubscribeCallout)
