import React, { useEffect, useMemo, useState } from 'react'
import { css } from 'glamor'

import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'

import { fontStyles, colors } from '@project-r/styleguide'

import { useResolvedColorSchemeKey } from '../../ColorScheme/lib'
import { SG_FONT_FACES } from '../../../lib/constants'

import { loadStripe } from '../stripe'
import StripeField from './StripeField'

const styles = {
  container: css({
    margin: '10px 0',
    lineHeight: 0
  })
}

const fieldElements = [
  { key: 'cardNumber', Element: CardNumberElement },
  { key: 'expiry', Element: CardExpiryElement },
  { key: 'cvc', Element: CardCvcElement }
]

const Form = React.forwardRef(
  ({ onChange, errors, dirty, t, unlockFieldKey, setUnlockFieldKey }, ref) => {
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

    const style = {
      base: {
        ...fontStyles.sansSerifRegular,
        fontSize: '22px',
        color: colors[colorSchemeKey].text,
        '::placeholder': {
          color: colors[colorSchemeKey].disabled
        }
      },
      invalid: {
        color: colors[colorSchemeKey].error
      }
    }

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
              card: elements.getElement(CardNumberElement)
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
        {fieldElements.map(({ key, Element }) => (
          <StripeField
            key={key}
            Element={Element}
            fieldKey={key}
            unlockFieldKey={unlockFieldKey}
            setUnlockFieldKey={setUnlockFieldKey}
            style={style}
            t={t}
            dirty={dirty}
            errors={errors}
            onChange={onChange}
          />
        ))}
      </div>
    )
  }
)

let stripeLoaded
let loadStripeNow
const stripePromise = new Promise(resolve => {
  loadStripeNow = () => {
    resolve()
    stripeLoaded = true
  }
}).then(() => {
  return loadStripe()
})

const PrivacyWrapper = React.forwardRef((props, ref) => {
  const { onChange, t } = props
  const [unlockFieldKey, setUnlockFieldKey] = useState(
    stripeLoaded ? 'auto' : undefined
  )

  useEffect(() => {
    if (unlockFieldKey && !stripeLoaded) {
      loadStripeNow()
    }
  }, [unlockFieldKey])
  const options = useMemo(() => {
    const fontFamily = fontStyles.sansSerifRegular.fontFamily.split(',')[0]
    const def = SG_FONT_FACES?.split('@font-face').find(d =>
      d.includes(fontFamily)
    )
    return {
      fonts: def
        ? [
            {
              family: fontFamily,
              weight: fontStyles.sansSerifRegular.fontWeight,
              src: def
                .split('src:')
                .slice(-1)[0] // get last src which wins in css
                .split(';')[0] // stop at ;
                .split('}')[0] // or }
            }
          ]
        : []
    }
  })
  useEffect(() => {
    onChange({
      errors: {
        cardNumber: t('payment/stripe/cardNumber/error/empty'),
        expiry: t('payment/stripe/expiry/error/empty'),
        cvc: t('payment/stripe/cvc/error/empty')
      }
    })
    return () => {
      onChange({
        errors: {
          cardNumber: undefined,
          expiry: undefined,
          cvc: undefined,
          stripe: undefined
        },
        dirty: {
          cardNumber: undefined,
          expiry: undefined,
          cvc: undefined
        }
      })
    }
  }, [])

  return (
    <Elements stripe={stripePromise} options={options}>
      <Form
        {...props}
        ref={ref}
        unlockFieldKey={unlockFieldKey}
        setUnlockFieldKey={setUnlockFieldKey}
      />
    </Elements>
  )
})

export default PrivacyWrapper
