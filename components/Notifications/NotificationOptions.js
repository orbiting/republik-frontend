import React, { Component, Fragment } from 'react'
import { flowRight as compose } from 'lodash'
import { graphql } from '@apollo/client/react/hoc'
import gql from 'graphql-tag'
import { css } from 'glamor'
import withT from '../../lib/withT'
import {
  isNotificationSupported,
  getNotificationPermission
} from '../../lib/utils/notification'

import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import { ZINDEX_CONTENT } from '../constants'

import Box from '../Frame/Box'
import {
  A,
  Loader,
  InlineSpinner,
  Checkbox,
  Dropdown,
  mediaQueries,
  Interaction
} from '@project-r/styleguide'

import {
  DISCUSSION_NOTIFICATION_CHANNELS,
  DISCUSSION_NOTIFICATION_OPTIONS
} from '../Discussion/constants'
import { withUpdateNotificationSettings } from '../Discussion/graphql/enhancers/withUpdateNotificationSettings'

const { P } = Interaction

const styles = {
  spinner: css({
    display: 'inline-block',
    height: 0,
    marginLeft: 15,
    verticalAlign: 'middle',
    '& > span': {
      display: 'inline'
    }
  }),
  dropdown: css({
    marginTop: 20,
    position: 'relative',
    zIndex: ZINDEX_CONTENT
  }),
  dropdownItem: css({
    fontSize: 16,
    [mediaQueries.mUp]: {
      fontSize: 'inherit'
    }
  })
}

const ErrorContainer = ({ children }) => (
  <div style={{ marginTop: 20 }}>{children}</div>
)

const WarningContainer = ({ children }) => (
  <Box style={{ margin: '10px 0', padding: 15 }}>{children}</Box>
)

class NotificationOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mutating: {}
    }
  }

  confirmPermission() {
    if (!isNotificationSupported()) {
      return
    }
    const { t, me, updateNotificationSettings } = this.props
    const { discussionNotificationChannels } = me

    window.Notification.requestPermission(status => {
      if (status !== 'granted') {
        return
      }
      // Globally opt in to the WEB notification channel.
      const channels =
        discussionNotificationChannels.indexOf('WEB') === -1
          ? [...discussionNotificationChannels, 'WEB']
          : discussionNotificationChannels
      updateNotificationSettings({
        discussionNotificationChannels: channels
      })
      /* eslint-disable no-new */
      new window.Notification(
        t('components/Discussion/WelcomeNotification/title'),
        {
          body: t('components/Discussion/WelcomeNotification/body'),
          icon: `${CDN_FRONTEND_BASE_URL}/static/apple-touch-icon.png`
        }
      )
    })
  }

  render() {
    const { t, me, loading, error, updateNotificationSettings } = this.props

    const notificationPermission = getNotificationPermission()
    const unsupportedClient = process.browser && !isNotificationSupported()

    return (
      <Loader
        loading={loading}
        error={error}
        ErrorContainer={ErrorContainer}
        render={() => {
          const {
            discussionNotificationChannels,
            defaultDiscussionNotificationOption
          } = me
          const { mutating } = this.state
          // the 'ALL' option is confusing as a default as it will show
          // on discussions but only gets truly 'activated' when you take
          // part in it, yielding a different behaviour from setting an
          // individual discussion to ALL.
          // The best resolution here seems to not show it in the overall
          // settings, except for the few users who have it set as such already
          const dropdownItems = DISCUSSION_NOTIFICATION_OPTIONS.filter(
            option =>
              defaultDiscussionNotificationOption === 'ALL' || option !== 'ALL'
          ).map(option => ({
            value: option,
            text: t(`components/Discussion/Notification/${option}/label`),
            element: (
              <span {...styles.dropdownItem}>
                {t(`components/Discussion/Notification/${option}/label`)}
              </span>
            )
          }))

          return (
            <Fragment>
              <P>{t('account/discussionNotificationChannels/intro')}</P>
              {DISCUSSION_NOTIFICATION_CHANNELS.map(channel => (
                <p key={channel}>
                  <Checkbox
                    checked={
                      discussionNotificationChannels.indexOf(channel) > -1
                    }
                    onChange={(_, checked) => {
                      let channels = [].concat(discussionNotificationChannels)
                      if (checked) {
                        channels.push(channel)
                      } else {
                        channels.splice(channels.indexOf(channel), 1)
                      }
                      this.setState(state => ({
                        mutating: {
                          ...state.mutating,
                          [channel]: true
                        }
                      }))
                      const finish = () => {
                        this.setState(state => ({
                          mutating: {
                            ...state.mutating,
                            [channel]: false
                          }
                        }))
                      }
                      updateNotificationSettings({
                        discussionNotificationChannels: channels
                      }).then(finish)
                    }}
                  >
                    {t(
                      `account/discussionNotificationChannels/${channel}/label`
                    )}
                    {mutating[channel] && (
                      <span {...styles.spinner}>
                        <InlineSpinner size={24} />
                      </span>
                    )}
                  </Checkbox>
                </p>
              ))}
              {notificationPermission === 'granted' && (
                <P>
                  {t('account/discussionNotificationChannels/WEB/hint/live')}
                </P>
              )}
              {notificationPermission === 'default' && (
                <WarningContainer>
                  <P>
                    {t(
                      'account/discussionNotificationChannels/WEB/hint/default'
                    )}
                    <br />
                    <A
                      style={{ cursor: 'pointer' }}
                      onClick={e => {
                        e.preventDefault()
                        this.confirmPermission()
                      }}
                    >
                      {t('account/discussionNotificationChannels/WEB/enable')}
                    </A>
                  </P>
                </WarningContainer>
              )}
              {notificationPermission === 'denied' &&
                discussionNotificationChannels.indexOf('WEB') > -1 && (
                  <WarningContainer>
                    <P>
                      {t(
                        'account/discussionNotificationChannels/WEB/hint/denied'
                      )}
                    </P>
                  </WarningContainer>
                )}
              {unsupportedClient && (
                <WarningContainer>
                  <P>
                    {t(
                      'account/discussionNotificationChannels/WEB/hint/unsupported'
                    )}
                  </P>
                </WarningContainer>
              )}
              <P style={{ marginTop: 10 }}>
                {t('account/notificationOptions/dialog')}
              </P>
              <div {...styles.dropdown}>
                <Dropdown
                  label={t('account/defaultDiscussionNotificationOption/label')}
                  items={dropdownItems}
                  value={defaultDiscussionNotificationOption}
                  onChange={item => {
                    const name = 'defaultDiscussionNotificationOption'
                    this.setState(state => ({
                      mutating: {
                        ...state.mutating,
                        [name]: true
                      }
                    }))
                    const finish = () => {
                      this.setState(state => ({
                        mutating: {
                          ...state.mutating,
                          [name]: false
                        }
                      }))
                    }
                    updateNotificationSettings({
                      defaultDiscussionNotificationOption: item.target
                        ? item.target.value
                        : item.value
                    }).then(finish)
                  }}
                />
                {mutating['defaultDiscussionNotificationOption'] && (
                  <span {...styles.spinner}>
                    <InlineSpinner size={24} />
                  </span>
                )}
              </div>
            </Fragment>
          )
        }}
      />
    )
  }
}

const query = gql`
  query myDiscussionNotificationSettings {
    me {
      id
      discussionNotificationChannels
      defaultDiscussionNotificationOption
    }
  }
`

export default compose(
  withUpdateNotificationSettings,
  graphql(query, {
    props: ({ data }) => ({
      loading: data.loading || !data.me,
      error: data.error,
      me: data.loading ? undefined : data.me
    })
  }),
  withT
)(NotificationOptions)
