import React from 'react'
import SubscribeCalloutTitle from './SubscribeCalloutTitle'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'

const SubscribeDocumentCallout = ({ subscription, format, setAnimate }) => {
  return (
    <>
      <SubscribeCalloutTitle
        isSubscribed={subscription && subscription.active}
      />
      <SubscribeDocumentCheckbox
        subscription={subscription}
        format={format}
        setAnimate={setAnimate}
        small
      />
    </>
  )
}

export default SubscribeDocumentCallout
