import React from 'react'
import SubscribeCheckbox from './SubscribeCheckbox'
import withT from '../../lib/withT'

const SubscribeDocument = ({ t, subscriptions, setAnimate, style }) => {
  return (
    <div style={style}>
      <h4>{t('SubscribeDocument/title')}</h4>
      {subscriptions.map(subscription => (
        <SubscribeCheckbox
          key={subscription.id}
          subscription={subscription}
          setAnimate={setAnimate}
          callout
        />
      ))}
    </div>
  )
}

export default withT(SubscribeDocument)
