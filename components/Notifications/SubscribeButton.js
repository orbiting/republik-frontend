import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import track from '../../lib/piwik'
import { compose, graphql } from 'react-apollo'
import { SubscribeIcon } from './SubscribeIcon'
import {
  subscribeToDocumentMutation,
  unsubscribeFromDocumentMutation
} from './enhancers'

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

const SubscribeButton = ({
  t,
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
  withT,
  graphql(subscribeToDocumentMutation, {
    props: ({ mutate }) => ({
      subToDoc: variables =>
        mutate({
          variables
        })
    })
  }),
  graphql(unsubscribeFromDocumentMutation, {
    props: ({ mutate }) => ({
      unsubFromDoc: variables =>
        mutate({
          variables
        })
    })
  })
)(SubscribeButton)
