import React from 'react'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'
import withT from '../../lib/withT'

const SubscribeDocument = ({ t, subscription, setAnimate, style }) => {
  return (
    <div style={style}>
      <h4>{t('SubscribeDocument/title')}</h4>
      <SubscribeDocumentCheckbox
        subscription={subscription}
        setAnimate={setAnimate}
        callout
      />
    </div>
  )
}

export default withT(SubscribeDocument)
