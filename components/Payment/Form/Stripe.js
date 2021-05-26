import React from 'react'

import {
  fontStyles,
  Label,
  colors,
  useColorContext
} from '@project-r/styleguide'

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { css } from 'glamor'

import { useResolvedColorSchemeKey } from '../../ColorScheme/lib'

const styles = {
  fieldContainer: css({
    margin: '10px 0',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid'
  })
}

const StripeForm = React.forwardRef(({ onChange, t }, ref) => {
  const [colorScheme] = useColorContext()
  const colorSchemeKey = useResolvedColorSchemeKey()
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
    <div
      {...styles.fieldContainer}
      {...colorScheme.set('borderColor', 'divider')}
    >
      <Label style={{ display: 'block', marginBottom: 8 }}>
        {t('payment/title/single/DEFAULT_SOURCE')}
      </Label>
      <CardElement
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
  )
})

export default StripeForm
