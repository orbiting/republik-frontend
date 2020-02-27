import React, { useState } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import track from '../../lib/piwik'
import { colors, fontStyles } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import SubscribeIcon from 'react-icons/lib/md/notifications'
import UnsubscribeIcon from 'react-icons/lib/md/notifications-off'

const styles = {
  button: css({
    float: 'right',
    marginBottom: 5,
    '& span, & h3': {
      display: 'block'
    },
    '@media print': {
      display: 'none'
    }
  }),
  legend: css({
    ...fontStyles.sansSerifRegular11,
    transition: 'all 0.3s',
    lineHeight: 1
  })
}

const SubscribeButton = ({ t, formatName }) => {
  const [isSubscribed, setSubscribed] = useState(false)
  const Icon = isSubscribed ? SubscribeIcon : UnsubscribeIcon

  return (
    <div {...styles.button} id='subscribe-button'>
      <div
        style={{ cursor: 'pointer', textAlign: 'center' }}
        onClick={() => {
          setSubscribed(!isSubscribed)
          track([
            'trackEvent',
            'subscribeFormat',
            isSubscribed ? 'subscribe' : 'unsubscribe',
            formatName
          ])
        }}
      >
        <Icon size={24} fill={isSubscribed ? colors.text : colors.lightText} />
        <span style={{ opacity: isSubscribed ? 1 : 0 }} {...styles.legend}>
          Subscribed
        </span>
      </div>
    </div>
  )
}

export default compose(withT)(SubscribeButton)
