import React, { useEffect, useState } from 'react'
import { Field, Spinner } from '@project-r/styleguide'

const StripeField = ({
  Element,
  fieldKey,
  style,
  t,
  dirty,
  errors,
  onChange,
  unlockFieldKey,
  setUnlockFieldKey,
  stripeLoadState
}) => {
  const [isEmpty, setEmpty] = useState(true)
  const [isFocussed, setFocus] = useState()

  useEffect(() => {
    onChange({
      errors: {
        [fieldKey]: t(`payment/stripe/${fieldKey}/error/empty`)
      }
    })
    return () => {
      onChange({
        errors: {
          [fieldKey]: undefined
        },
        dirty: {
          [fieldKey]: undefined
        }
      })
    }
  }, [])

  const label = t(`payment/stripe/${fieldKey}/label`)
  const error = dirty[fieldKey] && errors[fieldKey]

  return (
    <Field
      label={label}
      value={isEmpty ? '' : ' '}
      error={error}
      icon={
        stripeLoadState === 'loading' && unlockFieldKey === fieldKey ? (
          <span style={{ display: 'inline-block', height: 30, width: 30 }}>
            <Spinner size={30} />
          </span>
        ) : (
          undefined
        )
      }
      renderInput={
        !unlockFieldKey
          ? props => (
              <input
                {...props}
                onFocus={e => {
                  e.preventDefault()
                  setUnlockFieldKey(fieldKey)
                }}
              />
            )
          : ({ onFocus, onBlur, className }) => (
              <div className={className}>
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
                        values:
                          fieldKey === 'cardNumber'
                            ? {
                                cardType:
                                  event.brand === 'unknown'
                                    ? undefined
                                    : event.brand
                              }
                            : undefined,
                        errors: {
                          [fieldKey]: event.empty
                            ? t(`payment/stripe/${fieldKey}/error/empty`)
                            : event.error
                            ? t.first([
                                `payment/stripe/${fieldKey}/error/${event.error.code}`,
                                `payment/stripe/${fieldKey}/error/generic`
                              ])
                            : undefined
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
                        // CVC has a placeholder which says the samething as the label -> hide
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
