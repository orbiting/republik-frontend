import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import { matchPath, Router } from '../../lib/routes'
import { focusSelector } from '../../lib/utils/scroll'
import withT from '../../lib/withT'
import {
  isNotificationSupported,
  getNotificationPermission
} from '../../lib/utils/notification'
import {
  A,
  Dropdown,
  InlineSpinner,
  fontStyles,
  mediaQueries,
  colors
} from '@project-r/styleguide'
import Loader from '../Loader'
import NotificationIcon from './NotificationIcon'
import {
  DISCUSSION_NOTIFICATION_OPTIONS,
  withDiscussionPreferences,
  withSetDiscussionPreferences,
  webNotificationSubscription,
  withUpdateNotificationSettings
} from './enhancers'

const styles = {
  container: css({
    marginTop: 20,
    position: 'relative'
  }),
  spinner: css({
    position: 'absolute',
    top: 10,
    right: 5
  }),
  expanded: css({
    marginBottom: 30,
    marginTop: 20
  }),
  links: css({
    [mediaQueries.mUp]: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }),
  link: css({
    ...fontStyles.sansSerifRegular14,
    display: 'block',
    cursor: 'pointer'
  })
}

class NotificationOptions extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
      mutating: false,
      webNotificationsPermission: null
    }
  }

  componentDidMount () {
    this.subscribe()
    this.maybeMute()
  }

  componentDidUpdate () {
    this.subscribe()
    this.maybeMute()
  }

  initNotificationsState () {
    this.setState({
      webNotificationsPermission: getNotificationPermission()
    })
  }

  confirmPermission () {
    if (!isNotificationSupported()) {
      return
    }
    const { t, data, updateNotificationSettings } = this.props
    const { discussionNotificationChannels } = data && data.me

    window.Notification.requestPermission((status) => {
      if (status !== 'granted') {
        return
      }
      // Globally opt in to the WEB notification channel.
      const channels = discussionNotificationChannels.indexOf('WEB') === -1
        ? [...discussionNotificationChannels, 'WEB']
        : discussionNotificationChannels
      updateNotificationSettings({
        discussionNotificationChannels: channels
      })
      /* eslint-disable no-new */
      new window.Notification(t('components/Discussion/WelcomeNotification/title'), {
        body: t('components/Discussion/WelcomeNotification/body'),
        icon: `${CDN_FRONTEND_BASE_URL}/static/apple-touch-icon.png`
      })
    })
  }

  subscribe () {
    this.initNotificationsState()
    if (this.unsubscribe || !isNotificationSupported() || !this.props.data) {
      return
    }
    this.unsubscribe = this.props.data.subscribeToMore({
      document: webNotificationSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        const webNotification = subscriptionData.data && subscriptionData.data.webNotification
        if (!webNotification || this.state.webNotificationsPermission === 'denied') {
          return prev
        }
        /* eslint-disable no-new */
        const n = new window.Notification(webNotification.title, {
          body: webNotification.body,
          icon: webNotification.icon
        })
        n.onclick = (e) => {
          e.preventDefault() // prevent the browser from focusing the Notification's tab
          window.focus()
          window.location = webNotification.url
        }
        return prev
      }
    })
  }

  maybeMute () {
    const {
      data: { discussion },
      setDiscussionPreferences,
      mute
    } = this.props
    if (!mute || !discussion || this.state.mutating) {
      return
    }

    const {
      userPreference
    } = discussion

    const clearUrl = () => {
      const { url: { asPath, query } } = this.props
      const result = matchPath(asPath)
      const params = {
        ...query,
        ...result.params
      }
      // using delete instead of undefined to avoid an empty query
      delete params.mute
      Router.replaceRoute(
        result.route,
        params,
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

  componentWillUnmount () {
    this.unsubscribe && this.unsubscribe()
  }

  render () {
    const {
      t,
      data: {loading, error, me, discussion},
      setDiscussionPreferences
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
          const { defaultDiscussionNotificationOption, discussionNotificationChannels } = me
          const { userPreference } = discussion

          const notificationOptions = DISCUSSION_NOTIFICATION_OPTIONS.map(option => ({
            value: option,
            text: t(`components/Discussion/Notification/dropdown/${option}/label`)
          }))
          const selectedValue =
            (userPreference && userPreference.notifications) || defaultDiscussionNotificationOption

          const emailEnabled = discussionNotificationChannels.indexOf('EMAIL') > -1
          const browserEnabled = discussionNotificationChannels.indexOf('WEB') > -1 &&
            webNotificationsPermission === 'granted'
          const types = selectedValue !== 'NONE' && (
            (emailEnabled && browserEnabled && t(`components/Discussion/NotificationChannel/EMAIL_WEB/label`)) ||
            (emailEnabled && t(`components/Discussion/NotificationChannel/EMAIL/label`)) ||
            (browserEnabled && t(`components/Discussion/NotificationChannel/WEB/label`))
          )

          const color = selectedValue === 'NONE' ? colors.disabled : colors.primary

          return (
            <div {...styles.container}>
              <NotificationIcon off={selectedValue === 'NONE'} style={{fontSize: '14px', color}} fill={color} onClick={() => {
                this.setState(state => ({
                  expanded: !state.expanded
                }))
              }}>
                {t(`components/Discussion/info/${selectedValue}`, {
                  types
                })}
              </NotificationIcon>
              {expanded && <div {...styles.expanded}>
                <Dropdown
                  label={t('components/Discussion/Notification/dropdown/label')}
                  items={notificationOptions}
                  value={selectedValue}
                  onChange={(item) => {
                    const notifications = item.target ? item.target.value : item.value
                    this.setState(state => ({
                      mutating: true
                    }))
                    const finish = () => {
                      this.setState(state => ({
                        mutating: false
                      }))
                    }
                    // anonymity and credentials remain unchanged.
                    setDiscussionPreferences(undefined, undefined, notifications).then(
                      finish
                    )
                  }}
                />
                {mutating && (
                  <span {...styles.spinner}>
                    <InlineSpinner size={24} />
                  </span>
                )}
                <div {...styles.links}>
                  <A {...styles.link}
                    href='/konto#benachrichtigungen'
                    onClick={(e) => {
                      if (e.currentTarget.nodeName === 'A' &&
                        (e.metaKey || e.ctrlKey || e.shiftKey || (e.nativeEvent && e.nativeEvent.which === 2))) {
                        // ignore click for new tab / new window behavior
                        return
                      }

                      e.preventDefault()
                      Router.pushRoute('/konto#benachrichtigungen')
                        .then(() => {
                          focusSelector('#benachrichtigungen')
                        })
                    }}>
                    {t('components/Discussion/Notification/settings')}
                  </A>
                  {webNotificationsPermission === 'default' && (
                    <A {...styles.link} onClick={(e) => {
                      e.preventDefault()
                      this.confirmPermission()
                    }}>{t('components/Discussion/Notification/enable')}</A>
                  )}
                </div>
              </div>}

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
  data: PropTypes.object.isRequired,
  setDiscussionPreferences: PropTypes.func.isRequired,
  updateNotificationSettings: PropTypes.func.isRequired,
  mute: PropTypes.bool
}

export default compose(
  withT,
  withDiscussionPreferences,
  withSetDiscussionPreferences,
  withUpdateNotificationSettings
)(NotificationOptions)
