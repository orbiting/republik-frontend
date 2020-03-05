import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import track from '../../lib/piwik'
import { fontStyles } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import { SubscribeIcon } from './SubscribeIcon'

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
    transition: 'all 2s',
    lineHeight: 1
  })
}

const SubscribeButton = ({ t, formatId }) => {
  const [isSubscribed, setSubscribed] = useState(false)
  const [labelOpacity, setLabelOpacity] = useState(0)

  const toggleSubscribe = () => {
    if (!isSubscribed) {
      setSubscribed(true)
      setLabelOpacity(1)
    } else {
      setSubscribed(false)
      setLabelOpacity(0)
    }
    track([
      'trackEvent',
      'subscribeFormat',
      isSubscribed ? 'subscribe' : 'unsubscribe',
      formatId
    ])
  }

  useEffect(() => {
    if (labelOpacity) {
      const timeout = setTimeout(() => {
        setLabelOpacity(0)
      }, 5 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [labelOpacity])

  return (
    <div {...styles.button} id='subscribe-button'>
      <div
        style={{ cursor: 'pointer', textAlign: 'center' }}
        onClick={toggleSubscribe}
      >
        <SubscribeIcon isSubscribe={isSubscribed} />
        <span style={{ opacity: labelOpacity }} {...styles.legend}>
          Subscribed
        </span>
      </div>
    </div>
  )
}

export default compose(withT)(SubscribeButton)
