import React from 'react'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'
import withT from '../../lib/withT'
import Info from 'react-icons/lib/fa/info'
import { A } from '@project-r/styleguide'
import { css } from 'glamor'

const styles = {
  title: css({
    whiteSpace: 'nowrap'
  }),
  icon: css({
    fontSize: 12,
    marginLeft: 5,
    lineHeight: '20px',
    verticalAlign: 'top'
  })
}

const SubscribeDocument = ({ t, subscription, setAnimate, style }) => {
  return (
    <div style={style}>
      <h4 {...styles.title}>
        {t('SubscribeDocument/title')}
        <A href='#' {...styles.icon}>
          <Info />
        </A>
      </h4>
      <SubscribeDocumentCheckbox
        subscription={subscription}
        setAnimate={setAnimate}
        callout
      />
    </div>
  )
}

export default withT(SubscribeDocument)
