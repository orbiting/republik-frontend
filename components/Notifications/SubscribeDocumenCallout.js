import React, { useState } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { withSubToDoc, withUnsubFromDoc } from './enhancers'
import { Checkbox, fontStyles, mediaQueries } from '@project-r/styleguide'
import SubscribeCalloutTitle from './SubscribeCalloutTitle'
import NotificationChannelsLink from './NotificationChannelsLink'

const styles = {
  checkbox: css({
    marginTop: 12,
    '& label': {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      margin: '5px 0',
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular12
      }
    },
    '& svg': {
      [mediaQueries.mUp]: {
        width: 14,
        height: 14
      }
    },
    '& label > span > span': {
      [mediaQueries.mUp]: {
        width: 14,
        height: 14
      }
    }
  }),
  checkboxLabel: css({
    marginTop: -6
  })
}

const SubscribeDocumentCallout = ({
  subToDoc,
  unsubFromDoc,
  formatId,
  formatName,
  subscription,
  me
}) => {
  const [subscriptionId, setSubscriptionId] = useState(
    subscription && subscription.id
  )

  const toggleSubscribe = () => {
    if (!subscriptionId) {
      subToDoc({ documentId: formatId }).then(({ data }) => {
        setSubscriptionId(data.subscribe.id)
      })
    } else {
      unsubFromDoc({ subscriptionId: subscriptionId }).then(() => {
        setSubscriptionId(null)
      })
    }
  }

  return (
    <>
      <SubscribeCalloutTitle isSubscribed={subscriptionId} />
      <div {...styles.checkbox}>
        <Checkbox checked={subscriptionId} onChange={toggleSubscribe}>
          <span {...styles.checkboxLabel}>{formatName}</span>
        </Checkbox>
      </div>
      <div style={{ marginTop: -8 }}>
        <NotificationChannelsLink me={me} />
      </div>
    </>
  )
}

export default compose(
  withSubToDoc,
  withUnsubFromDoc
)(SubscribeDocumentCallout)
