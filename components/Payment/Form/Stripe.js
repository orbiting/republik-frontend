import React, { useEffect } from 'react'

import { fontStyles, colors, Field } from '@project-r/styleguide'

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { css } from 'glamor'

import { useResolvedColorSchemeKey } from '../../ColorScheme/lib'

const styles = {
  container: css({
    margin: '10px 0'
  })
}

const StripeForm = React.forwardRef(({ onChange, errors, dirty, t }, ref) => {
  const colorSchemeKey = useResolvedColorSchemeKey()
  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    if (stripe && elements && errors.stripe) {
      onChange({
        errors: {
          stripe: undefined
        }
      })
    }
  }, [stripe, elements, errors])
  useEffect(() => {
    onChange({
      errors: {
        card: t('payment/stripe/card/missing')
      }
    })
    return () => {
      onChange({
        errors: {
          card: undefined,
          stripe: undefined
        }
      })
    }
  }, [])

  ref({
    createPaymentMethod: () => {
      if (!stripe || !elements) {
        onChange({
          errors: {
            stripe: t('payment/stripe/js/loading')
          }
        })
        return
      }
      return new Promise((resolve, reject) => {
        stripe
          .createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
          })
          .then(result => {
            if (result.error) {
              reject(result.error.message)
            } else {
              resolve(result.paymentMethod)
            }
          })
      })
    }
  })

  return (
    <div {...styles.container}>
      <Field
        label={t('payment/stripe/card/label')}
        value=' '
        error={dirty.card && errors.card && t('payment/stripe/card/label')}
        renderInput={({ onFocus, onBlur, className }) => (
          <div className={className} style={{ paddingTop: 8 }}>
            <CardElement
              onFocus={onFocus}
              onBlur={() => {
                onBlur({
                  target: { value: ' ' }
                })
              }}
              onChange={event => {
                onChange({
                  errors: {
                    card: event.error?.message
                  },
                  dirty: {
                    card: true
                  }
                })
              }}
              options={{
                hidePostalCode: true,
                iconStyle: colorSchemeKey === 'dark' ? 'solid' : 'default',
                style: {
                  base: {
                    fontSize: '22px',
                    ...fontStyles.sansSerifRegular,
                    color: colors[colorSchemeKey].text,
                    '::placeholder': {
                      color: colors[colorSchemeKey].disabled
                    },
                    ':disabled': {
                      color: colors[colorSchemeKey].disabled
                    }
                  },
                  invalid: {
                    color: colors[colorSchemeKey].error
                  }
                }
              }}
            />
          </div>
        )}
      />
    </div>
  )
})

export default StripeForm
