import React, { useState } from 'react'
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
  const [isEmpty, setEmpty] = useState(true)
  const [isFocussed, setFocus] = useState()
  const label = t(`payment/stripe/${fieldKey}/label`)
  const error = dirty[fieldKey] && errors[fieldKey] && label
  return (
    <Field
      label={label}
      value={isEmpty ? '' : ' '}
      error={error}
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
              <div
                className={className}
                style={{
                  paddingTop: 8
                }}
              >
                <div
                  style={{ opacity: isFocussed || !isEmpty || error ? 1 : 0 }}
                >
                  <Element
                    onFocus={() => {
                      setFocus(true)
                      onFocus()
                    }}
                    onBlur={() => {
                      setFocus(false)
                      onBlur({
                        target: { value: isEmpty ? '' : ' ' }
                      })
                    }}
                    onChange={event => {
                      setEmpty(event.empty)
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
                      style:
                        fieldKey === 'cvc'
                          ? {
                              ...style,
                              base: {
                                ...style.base,
                                '::placeholder': {
                                  color: 'transparent'
                                }
                              }
                            }
                          : style
                    }}
                  />
                </div>
              </div>
            )
      }
    />
  )
}

export default StripeField
