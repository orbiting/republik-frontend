import React from 'react'
import SubscribeCheckbox from './SubscribeCheckbox'
import withT from '../../lib/withT'
import { css } from 'glamor'
import { fontStyles } from '@project-r/styleguide'

const SubscribeDocument = ({ t, subscriptions, setAnimate, style }) => {
  return (
    <div style={style}>
      <h4 {...styles.title}>{t('SubscribeDocument/title')}</h4>
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

const styles = {
  title: css({
    margin: '0 0 12px',
    fontWeight: 'inherit',
    ...fontStyles.sansSerifMedium
  })
}

export default withT(SubscribeDocument)
