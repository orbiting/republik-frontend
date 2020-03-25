import React from 'react'
import { Checkbox, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import { withSubToDoc, withUnsubFromDoc } from './enhancers'
import { css } from 'glamor'

const styles = {
  checkbox: css({
    display: 'inline-block',
    width: '100%',
    [mediaQueries.mUp]: {
      width: '50%'
    }
  }),
  checkboxCallout: css({
    '& label': {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center'
    }
  }),
  checkboxLabelCallout: css({
    marginTop: -6
  })
}

const SubscribeDocumentCheckbox = ({
  subToDoc,
  unsubFromDoc,
  subscription,
  setAnimate,
  callout
}) => {
  const isActive = subscription.active

  const toggleCallback = () => setAnimate && setAnimate(true)

  const toggleSubscribe = () => {
    if (isActive) {
      unsubFromDoc({ subscriptionId: subscription.id }).then(toggleCallback)
    } else {
      subToDoc({ documentId: subscription.object.id }).then(toggleCallback)
    }
  }

  return (
    <div {...(callout ? styles.checkboxCallout : styles.checkbox)}>
      <Checkbox checked={isActive} onChange={toggleSubscribe}>
        <span {...(callout && styles.checkboxLabelCallout)}>
          {subscription.object.meta.title}
        </span>
      </Checkbox>
    </div>
  )
}

export default compose(
  withSubToDoc,
  withUnsubFromDoc
)(SubscribeDocumentCheckbox)
