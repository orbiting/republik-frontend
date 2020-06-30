import React from 'react'
import { Checkbox, mediaQueries } from '@project-r/styleguide'
import { compose } from 'react-apollo'
import { withSubToDoc, withUnsubFromDoc, withSubToUser } from './enhancers'
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
      fontSize: 16,
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center'
    }
  }),
  checkboxLabelCallout: css({
    marginTop: -6
  })
}

const SubscribeCheckbox = ({
  subToDoc,
  unsubFromDoc,
  subToUser,
  subscription,
  setAnimate,
  callout
}) => {
  const isActive = subscription.active
  const isDocument = subscription.object.__typename === 'Document'

  const toggleCallback = () => setAnimate && setAnimate(true)

  const toggleSubscribe = () => {
    if (isActive) {
      if (isDocument) {
        unsubFromDoc({ subscriptionId: subscription.id }).then(toggleCallback)
      } else {
        return
      }
    } else {
      if (isDocument) {
        subToDoc({ documentId: subscription.object.id }).then(toggleCallback)
      } else {
        subToUser({ userId: subscription.object.id, filter: [] })
      }
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
  withUnsubFromDoc,
  withSubToUser
  // Add unsubscribe
)(SubscribeCheckbox)
