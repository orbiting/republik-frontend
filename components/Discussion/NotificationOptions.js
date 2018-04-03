import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import { CDN_FRONTEND_BASE_URL } from '../../lib/constants'
import withT from '../../lib/withT'
import {
  isNotificationSupported,
  getNotificationPermission
} from '../../lib/utils/notification'
import {
  A,
  Dropdown,
  InlineSpinner
} from '@project-r/styleguide'
import Loader from '../Loader'
import {
  DISCUSSION_NOTIFICATION_OPTIONS,
  withDiscussionPreferences,
  withSetDiscussionPreferences,
  webNotificationSubscription,
  withUpdateNotificationSettings
} from './enhancers'

const styles = {
  container: css({
    marginTop: '20px',
    position: 'relative'
  }),
  spinner: css({
    position: 'absolute',
    top: 10,
    right: 5
  })
}

class NotificationOptions extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
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
      })
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
          const { mutating, webNotificationsPermission } = this.state
          const { defaultDiscussionNotificationOption, discussionNotificationChannels } = me
          const { userPreference } = discussion

          const notificationOptions = DISCUSSION_NOTIFICATION_OPTIONS.map(option => ({
            value: option,
            text: t(`components/Discussion/Notification/${option}/label`)
          }))
          const selectedValue =
            (userPreference && userPreference.notifications) || defaultDiscussionNotificationOption

          // Construct dropdown label including effective channels, e.g. "(E-Mail, Browser)".
          let channels = [...discussionNotificationChannels]
          if (channels.indexOf('WEB') > -1 && webNotificationsPermission !== 'granted') {
            channels.splice(channels.indexOf('WEB'), 1)
          }
          const channelsInfo = channels.length
            ? ' (' +
              channels
                .map(channel => t(`components/Discussion/NotificationChannel/${channel}/label`))
                .join(', ') +
              ')'
            : ''
          const dropdownLabel = `${t('components/Discussion/Notification/label')}${channelsInfo}`

          return (
            <div {...styles.container}>
              <Dropdown
                label={dropdownLabel}
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
              {webNotificationsPermission === 'default' && (
                <A style={{fontSize: '14px', cursor: 'pointer'}} onClick={(e) => {
                  e.preventDefault()
                  this.confirmPermission()
                }}>{t('components/Discussion/Notification/enable')}</A>
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
