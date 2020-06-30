import React from 'react'
import SubscribeCheckbox from './SubscribeCheckbox'
import withT from '../../lib/withT'

const SubscribeDocument = ({ t, subscription, setAnimate, style }) => {
  return (
    <div style={style}>
      <h4>{t('SubscribeDocument/title')}</h4>
      <SubscribeCheckbox
        subscription={subscription}
        setAnimate={setAnimate}
        callout
      />
    </div>
  )
}

export default withT(SubscribeDocument)
