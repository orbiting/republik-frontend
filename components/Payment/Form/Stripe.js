import React, { useEffect, useMemo, useState } from 'react'
import { css } from 'glamor'

import {
  Elements,
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'

import { fontStyles, colors, Field } from '@project-r/styleguide'

import { loadStripe } from '../stripe'
import { useResolvedColorSchemeKey } from '../../ColorScheme/lib'
import { SG_FONT_FACES } from '../../../lib/constants'

const styles = {
  container: css({
    margin: '10px 0',
    lineHeight: 0
  })
}

const LiveForm = React.forwardRef(({ onChange, errors, dirty, t }, ref) => {
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
              onReady={element => {
                element.focus()
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

const PlaceholderForm = React.forwardRef(
  ({ onChange, t, setPrivacyShield }, ref) => {
    ref({
      createPaymentMethod: () => {
        onChange({
          errors: {
            card: t('payment/stripe/card/missing')
          }
        })
      }
    })

    return (
      <div {...styles.container}>
        <Field
          label={t('payment/stripe/card/placeholder')}
          value={''}
          renderInput={props => (
            <input
              {...props}
              onFocus={() => {
                setPrivacyShield(false)
              }}
            />
          )}
        />
      </div>
    )
  }
)

const ContextWrapper = React.forwardRef((props, ref) => {
  const { onChange, t } = props
  const stripe = useMemo(() => {
    return loadStripe().catch(() => {
      onChange({
        errors: {
          stripe: t('payment/stripe/js/failed')
        }
      })
    })
  }, [])
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

  return (
    <Elements stripe={stripe} options={options}>
      <LiveForm {...props} ref={ref} />
    </Elements>
  )
})

const PrivacyWrapper = React.forwardRef((props, ref) => {
  const { onChange, t } = props
  const [privacyShield, setPrivacyShield] = useState(true)

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
        },
        dirty: {
          card: undefined
        }
      })
    }
  }, [])

  return privacyShield ? (
    <PlaceholderForm {...props} setPrivacyShield={setPrivacyShield} ref={ref} />
  ) : (
    <ContextWrapper {...props} ref={ref} />
  )
})

export default PrivacyWrapper
