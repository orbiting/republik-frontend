import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import track from '../../lib/piwik'
import { compose } from 'react-apollo'
import { SubscribeIcon } from './SubscribeIcon'
import { withSubToDoc, withUnsubFromDoc } from './enhancers'

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
  })
}

const SubscribeDocumentButton = ({
  formatId,
  subscription,
  subToDoc,
  unsubFromDoc
}) => {
  const [subscriptionId, setSubscriptionId] = useState(
    subscription && subscription.id
  )
  const [animate, setAnimate] = useState(false)

  const toggleSubscribe = () => {
    if (!subscriptionId) {
      subToDoc({ documentId: formatId }).then(({ data }) => {
        setSubscriptionId(data.subscribe.id)
        setAnimate(true)
      })
    } else {
      unsubFromDoc({ subscriptionId: subscriptionId }).then(() => {
        setSubscriptionId(null)
        setAnimate(true)
      })
    }
    track([
      'trackEvent',
      'subscribeFormat',
      subscriptionId ? 'subscribe' : 'unsubscribe',
      formatId
    ])
  }

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 5 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [animate])

  return (
    <div {...styles.button} id='subscribe-button'>
      <div
        style={{ cursor: 'pointer', textAlign: 'center' }}
        onClick={toggleSubscribe}
      >
        <SubscribeIcon animate={animate} isSubscribed={subscriptionId} legend />
      </div>
    </div>
  )
}

export default compose(
  withSubToDoc,
  withUnsubFromDoc
)(SubscribeDocumentButton)
