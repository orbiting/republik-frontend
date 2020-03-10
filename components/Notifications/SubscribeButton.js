import React, { useState, useEffect } from 'react'
import { css } from 'glamor'
import withT from '../../lib/withT'
import track from '../../lib/piwik'
import { fontStyles } from '@project-r/styleguide'
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
  }),
  legend: css({
    ...fontStyles.sansSerifRegular11,
    transition: 'all 2s',
    lineHeight: 1
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
  const [labelOpacity, setLabelOpacity] = useState(0)

  const toggleSubscribe = () => {
    if (!subscriptionId) {
      subToDoc({ documentId: formatId }).then(({ data }) => {
        setSubscriptionId(data.subscribe.id)
        setLabelOpacity(1)
      })
    } else {
      unsubFromDoc({ subscriptionId: subscriptionId }).then(() => {
        setSubscriptionId(null)
        setLabelOpacity(0)
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
        <SubscribeIcon isSubscribed={subscriptionId} />
        <span style={{ opacity: labelOpacity }} {...styles.legend}>
          Subscribed
        </span>
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
