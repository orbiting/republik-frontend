import React from 'react'
import SubscribeDebate from './SubscribeDebate'
import SubscribeDocument from './SubscribeDocument'
import { css } from 'glamor'
import { fontFamilies } from '@project-r/styleguide'

const styles = {
  container: css({
    '& h4': {
      margin: '0 0 12px',
      fontFamily: fontFamilies.sansSerifMedium,
      fontWeight: 'inherit'
    }
  })
}

const SubscribeCallout = ({ discussionId, subscription, setAnimate }) => {
  return (
    <div {...styles.container}>
      {discussionId && (
        <SubscribeDebate discussionId={discussionId} setAnimate={setAnimate} />
      )}
      {subscription && (
        <SubscribeDocument
          subscription={subscription}
          setAnimate={setAnimate}
          style={{ marginTop: discussionId ? 15 : 0 }}
        />
      )}
    </div>
  )
}

export default SubscribeCallout
