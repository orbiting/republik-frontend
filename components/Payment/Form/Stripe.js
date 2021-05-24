import React from 'react'

import { fontStyles, Label, colors } from '@project-r/styleguide'

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

const StripeForm = React.forwardRef(({ onChange, t }, ref) => {
  const stripe = useStripe()
  const elements = useElements()

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
    <div style={{ margin: '10px 0' }}>
      <Label style={{ display: 'block', marginBottom: 8 }}>
        {t('payment/title/single/DEFAULT_SOURCE')}
      </Label>
      <CardElement
        options={{
          hidePostalCode: true,
          // iconStyle: 'solid',
          style: {
            base: {
              fontSize: '22px',
              ...fontStyles.sansSerifRegular,
              color: colors.light.text,
              borderBottom: `1px solid ${colors.light.divider}`,
              '::placeholder': {
                color: colors.light.disabled
              },
              ':disabled': {
                color: colors.light.disabled
              }
            },
            invalid: {
              color: colors.light.error
            }
          }
        }}
      />
    </div>
  )
})

export default StripeForm
