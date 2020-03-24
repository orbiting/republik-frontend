import React from 'react'
import SubscribeCalloutTitle from './SubscribeCalloutTitle'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'

const SubscribeDocumentCallout = ({ subscription, setAnimate }) => {
  return (
    <>
      <SubscribeCalloutTitle
        isSubscribed={subscription && subscription.active}
      />
      <SubscribeDocumentCheckbox
        subscription={subscription}
        setAnimate={setAnimate}
        small
      />
    </>
  )
}

export default SubscribeDocumentCallout
