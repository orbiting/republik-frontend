import React from 'react'
import { Field } from '@project-r/styleguide'

const StripeField = ({
  Element,
  fieldKey,
  style,
  t,
  dirty,
  errors,
  onChange,
  unlockFieldKey,
  setUnlockFieldKey
}) => {
  const label = t(`payment/stripe/${fieldKey}/label`)
  return (
    <Field
      label={label}
      value={unlockFieldKey ? ' ' : ''}
      error={dirty[fieldKey] && errors[fieldKey] && label}
      renderInput={
        !unlockFieldKey
          ? props => (
              <input
                {...props}
                onFocus={() => {
                  setUnlockFieldKey(fieldKey)
                }}
              />
            )
          : ({ onFocus, onBlur, className }) => (
              <div className={className} style={{ paddingTop: 8 }}>
                <Element
                  onFocus={onFocus}
                  onBlur={() => {
                    onBlur({
                      target: { value: ' ' }
                    })
                  }}
                  onChange={event => {
                    onChange({
                      errors: {
                        [fieldKey]: event.error?.message
                      },
                      dirty: {
                        [fieldKey]: true
                      }
                    })
                  }}
                  onReady={element => {
                    if (unlockFieldKey === fieldKey) {
                      element.focus()
                    }
                  }}
                  options={{
                    style
                  }}
                />
              </div>
            )
      }
    />
  )
}

export default StripeField
