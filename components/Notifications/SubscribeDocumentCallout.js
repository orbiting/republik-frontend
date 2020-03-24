import React from 'react'
import SubscribeCalloutTitle from './SubscribeCalloutTitle'
import SubscribeDocumentCheckbox from './SubscribeDocumentCheckbox'
import { css } from 'glamor'
import { fontFamilies, mediaQueries } from '@project-r/styleguide'
const styles = {
  subtitle: css({
    fontFamily: fontFamilies.sansSerifItalic,
    marginBottom: 0,
    [mediaQueries.mUp]: {
      fontSize: 12
    }
  })
}

const SubscribeDocumentCallout = ({
  subscription,
  setAnimate,
  hideTitle,
  subtitle
}) => {
  return (
    <div style={{ textAlign: 'left' }}>
      {!hideTitle && (
        <SubscribeCalloutTitle
          isSubscribed={subscription && subscription.active}
        />
      )}
      {subtitle && <p {...styles.subtitle}>{subtitle}</p>}
      <SubscribeDocumentCheckbox
        subscription={subscription}
        setAnimate={setAnimate}
        small
      />
    </div>
  )
}

export default SubscribeDocumentCallout
