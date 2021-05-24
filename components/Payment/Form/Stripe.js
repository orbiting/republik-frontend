import React from 'react'

import { fontStyles } from '@project-r/styleguide'

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
    <CardElement
      options={{
        hidePostalCode: true,
        // iconStyle: 'solid',
        style: {
          base: {
            fontSize: '22px',
            ...fontStyles.sansSerifRegular,
            // color: colors.text,
            // borderBottom: '1px solid black',
            '::placeholder': {
              // color: colors.disabled
            },
            ':disabled': {
              // color: colors.disabled
            }
          },
          invalid: {
            // color: colors.error
          }
        }
      }}
    />
  )
})

export default StripeForm
