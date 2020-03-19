import React from 'react'
import { Checkbox, fontStyles, mediaQueries } from '@project-r/styleguide'
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
  checkboxSmall: css({
    marginTop: 12,
    '& label': {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      margin: '5px 0',
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular12
      }
    },
    '& svg': {
      [mediaQueries.mUp]: {
        width: 14,
        height: 14
      }
    },
    '& label > span > span': {
      [mediaQueries.mUp]: {
        width: 14,
        height: 14
      }
    }
  }),
  checkboxLabelSmall: css({
    marginTop: -6
  })
}

const SubscribeDocumentCheckbox = ({
  subToDoc,
  unsubFromDoc,
  subscription,
  format,
  small,
  setAnimate
}) => {
  const formatId = format && format.id
  const formatName = format && format.meta && format.meta.title
  const isActive = subscription && subscription.active

  const toggleCallback = () => setAnimate && setAnimate(true)

  const toggleSubscribe = () => {
    if (isActive) {
      unsubFromDoc({ subscriptionId: subscription.id }).then(toggleCallback)
    } else {
      subToDoc({ documentId: formatId }).then(toggleCallback)
    }
  }

  return (
    <div {...(small ? styles.checkboxSmall : styles.checkbox)}>
      <Checkbox checked={isActive} onChange={toggleSubscribe}>
        <span {...(small && styles.checkboxLabelSmall)}>{formatName}</span>
      </Checkbox>
    </div>
  )
}

export default compose(
  withSubToDoc,
  withUnsubFromDoc
)(SubscribeDocumentCheckbox)