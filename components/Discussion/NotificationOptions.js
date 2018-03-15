import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import { css } from 'glamor'
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
  }

  componentDidUpdate () {
    this.subscribe()
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

    window.Notification.requestPermission(function (status) {
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
        icon: 'https://cdn.republik.space/frontend/static/apple-touch-icon.png'
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
        new window.Notification(webNotification.title, {
          body: webNotification.body,
          icon: webNotification.icon
        })
        return prev
      }
    })
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

          // Preserve existing user prefences.
          const anonymity = userPreference ? userPreference.anonymity : false
          const credential = userPreference ? userPreference.credential.description : null

          return (
            <div {...styles.container}>
              <Dropdown
                label={dropdownLabel}
                items={notificationOptions}
                value={selectedValue}
                onChange={(item) => {
                  const notifications = item.value
                  this.setState(state => ({
                    mutating: true
                  }))
                  const finish = () => {
                    this.setState(state => ({
                      mutating: false
                    }))
                  }
                  setDiscussionPreferences(anonymity, credential, notifications).then(
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
  updateNotificationSettings: PropTypes.func.isRequired
}

export default compose(
  withT,
  withDiscussionPreferences,
  withSetDiscussionPreferences,
  withUpdateNotificationSettings
)(NotificationOptions)
