import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { flowRight as compose } from 'lodash'
import { withRouter } from 'next/router'
import { css } from 'glamor'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import { focusSelector } from '../../lib/utils/scroll'
import withT from '../../lib/withT'
import {
  isNotificationSupported,
  getNotificationPermission
} from '../../lib/utils/notification'
import {
  Loader,
  A,
  Dropdown,
  InlineSpinner,
  fontStyles,
  mediaQueries,
  colors,
  convertStyleToRem,
  pxToRem
} from '@project-r/styleguide'
import NotificationIcon from './NotificationIcon'
import { DISCUSSION_NOTIFICATION_OPTIONS } from './constants'

import { webNotificationSubscription } from './graphql/documents'
import { withDiscussionPreferences } from './graphql/enhancers/withDiscussionPreferences'
import { withUpdateNotificationSettings } from './graphql/enhancers/withUpdateNotificationSettings'

import { shouldIgnoreClick } from '../../lib/utils/link'

const styles = {
  container: css({
    marginTop: pxToRem(20),
    position: 'relative'
  }),
  spinner: css({
    position: 'absolute',
    top: 10,
    right: 5
  }),
  expanded: css({
    marginBottom: pxToRem(30),
    marginTop: pxToRem(20)
  }),
  links: css({
    [mediaQueries.mUp]: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }),
  link: css({
    ...convertStyleToRem(fontStyles.sansSerifRegular14),
    display: 'block',
    cursor: 'pointer'
  }),
  dropdownItem: css({
    fontSize: pxToRem(16),
    [mediaQueries.mUp]: {
      fontSize: 'inherit'
    }
  })
}

class NotificationOptions extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
      mutating: false,
      webNotificationsPermission: null
    }
  }

  componentDidMount() {
    this.subscribe()
    this.maybeMute()
  }

  componentDidUpdate() {
    this.subscribe()
    this.maybeMute()
  }

  initNotificationsState() {
    this.setState({
      webNotificationsPermission: getNotificationPermission()
    })
  }

  confirmPermission() {
    if (!isNotificationSupported()) {
      return
    }
    const { t, discussionPreferences, updateNotificationSettings } = this.props
    const { discussionNotificationChannels } =
      discussionPreferences && discussionPreferences.me

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
      this.initNotificationsState()
    })
  }

  subscribe() {
    this.initNotificationsState()
    if (
      this.unsubscribe ||
      !isNotificationSupported() ||
      !this.props.discussionPreferences
    ) {
      return
    }
    this.unsubscribe = this.props.discussionPreferences.subscribeToMore({
      document: webNotificationSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        const webNotification =
          subscriptionData.data && subscriptionData.data.webNotification
        if (
          !webNotification ||
          this.state.webNotificationsPermission === 'denied'
        ) {
          return prev
        }
        /* eslint-disable no-new */
        const n = new window.Notification(webNotification.title, {
          body: webNotification.body,
          icon: webNotification.icon,
          tag: webNotification.tag
        })
        n.onclick = e => {
          e.preventDefault() // prevent the browser from focusing the Notification's tab
          window.focus()
          window.location = webNotification.url
        }
        return prev
      }
    })
  }

  maybeMute() {
    const {
      discussionPreferences: { discussion },
      setDiscussionPreferences,
      mute
    } = this.props
    if (!mute || !discussion || this.state.mutating) {
      return
    }

    const { userPreference } = discussion

    const clearUrl = () => {
      const { router } = this.props
      const { pathname, query } = router
      router.replace(
        {
          pathname,
          query
        },
        undefined,
        { shallow: true }
      )
    }

    // Mute notifications for this discussion if not already done
    if (!userPreference || userPreference.notifications !== 'NONE') {
      this.setState({
        mutating: true
      })

      // anonymity and credentials remain unchanged.
      setDiscussionPreferences(undefined, undefined, 'NONE').then(() => {
        this.setState({
          mutating: false
        })
        clearUrl()
      })
    } else {
      clearUrl()
    }
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    const {
      t,
      discussionPreferences: { loading, error, me, discussion },
      setDiscussionPreferences,
      router
    } = this.props

    if (!me) {
      return null
    }
    return (
      <Loader
        loading={loading}
        error={error}
        message={t('components/DiscussionPreferences/loading')}
        render={() => {
          const { expanded, mutating, webNotificationsPermission } = this.state
          const {
            defaultDiscussionNotificationOption,
            discussionNotificationChannels
          } = me
          const { userPreference } = discussion

          const notificationOptions = DISCUSSION_NOTIFICATION_OPTIONS.map(
            option => ({
              value: option,
              text: t(
                `components/Discussion/Notification/dropdown/${option}/label`
              ),
              element: (
                <span {...styles.dropdownItem}>
                  {t(
                    `components/Discussion/Notification/dropdown/${option}/label`
                  )}
                </span>
              )
            })
          )
          const selectedValue =
            (userPreference &&
              userPreference.notifications !== null &&
              userPreference.notifications) ||
            defaultDiscussionNotificationOption

          const emailEnabled =
            discussionNotificationChannels.indexOf('EMAIL') > -1
          const browserEnabled =
            discussionNotificationChannels.indexOf('WEB') > -1 &&
            webNotificationsPermission === 'granted'
          const appEnabled = discussionNotificationChannels.indexOf('APP') > -1
          const notificationsChannelEnabled =
            emailEnabled || browserEnabled || appEnabled

          const translationKey =
            selectedValue !== 'NONE' &&
            ((emailEnabled &&
              browserEnabled &&
              appEnabled &&
              'EMAIL_WEB_APP') ||
              (emailEnabled && browserEnabled && 'EMAIL_WEB') ||
              (emailEnabled && appEnabled && 'EMAIL_APP') ||
              (browserEnabled && appEnabled && 'WEB_APP') ||
              (emailEnabled && 'EMAIL') ||
              (appEnabled && 'APP') ||
              (browserEnabled && 'WEB'))
          const types =
            translationKey &&
            t(
              `components/Discussion/NotificationChannel/${translationKey}/label`
            )

          const color =
            selectedValue === 'NONE' ? colors.disabled : colors.primary

          return (
            <div {...styles.container}>
              {!notificationsChannelEnabled && (
                <A
                  {...styles.link}
                  href='/konto#benachrichtigungen'
                  onClick={e => {
                    if (shouldIgnoreClick(e)) {
                      return
                    }

                    e.preventDefault()
                    router.push('/konto#benachrichtigungen').then(() => {
                      focusSelector('#benachrichtigungen')
                    })
                  }}
                >
                  {t('components/Discussion/Notification/noChannels')}
                </A>
              )}
              {notificationsChannelEnabled && (
                <Fragment>
                  <NotificationIcon
                    off={selectedValue === 'NONE'}
                    style={{ fontSize: '14px', color }}
                    fill={color}
                    onClick={() => {
                      this.setState(state => ({
                        expanded: !state.expanded
                      }))
                    }}
                  >
                    {t(`components/Discussion/info/${selectedValue}`, {
                      types
                    })}
                  </NotificationIcon>
                  {expanded && (
                    <div {...styles.expanded}>
                      <Dropdown
                        label={t(
                          'components/Discussion/Notification/dropdown/label'
                        )}
                        items={notificationOptions}
                        value={selectedValue}
                        onChange={item => {
                          const notifications = item.target
                            ? item.target.value
                            : item.value
                          this.setState(state => ({
                            mutating: true
                          }))
                          const finish = () => {
                            this.setState(state => ({
                              mutating: false
                            }))
                          }
                          // anonymity and credentials remain unchanged.
                          setDiscussionPreferences(
                            undefined,
                            undefined,
                            notifications
                          ).then(finish)
                        }}
                      />
                      {mutating && (
                        <span {...styles.spinner}>
                          <InlineSpinner size={24} />
                        </span>
                      )}
                      <div {...styles.links}>
                        <A
                          {...styles.link}
                          href='/konto#benachrichtigungen'
                          onClick={e => {
                            if (shouldIgnoreClick(e)) {
                              return
                            }

                            e.preventDefault()
                            router
                              .push('/konto#benachrichtigungen')
                              .then(() => {
                                focusSelector('#benachrichtigungen')
                              })
                          }}
                        >
                          {t('components/Discussion/Notification/settings')}
                        </A>
                        {webNotificationsPermission === 'default' && (
                          <A
                            {...styles.link}
                            onClick={e => {
                              e.preventDefault()
                              this.confirmPermission()
                            }}
                          >
                            {t('components/Discussion/Notification/enable')}
                          </A>
                        )}
                      </div>
                    </div>
                  )}
                </Fragment>
              )}
            </div>
          )
        }}
      />
    )
  }
}

NotificationOptions.propTypes = {
  discussionId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  discussionPreferences: PropTypes.object.isRequired,
  setDiscussionPreferences: PropTypes.func.isRequired,
  updateNotificationSettings: PropTypes.func.isRequired,
  mute: PropTypes.bool
}

export default compose(
  withT,
  withRouter,
  withDiscussionPreferences,
  withUpdateNotificationSettings
)(NotificationOptions)
