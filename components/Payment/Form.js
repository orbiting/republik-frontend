import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose } from 'react-apollo'

import {
  Interaction, Label,
  colors, fontFamilies
} from '@project-r/styleguide'

import withT from '../../lib/withT'

import FieldSet from '../FieldSet'

import AddressForm from '../Account/AddressForm'

import {
  PF_FORM_ACTION,
  PAYPAL_FORM_ACTION
} from '../../lib/constants'

import * as postfinance from './postfinance'
import * as paypal from './paypal'
import loadStripe from './stripe'

import LockIcon from './Icons/Lock'
import * as PSPIcons from './Icons/PSP'

const PAYMENT_METHODS = [
  {
    disabled: false,
    key: 'STRIPE',
    Icon: ({state: {stripe}, values}) => {
      let cardType = null
      if (stripe && values && values.cardNumber) {
        cardType = stripe.card.cardType(values.cardNumber)
        if (cardType === 'Unknown') {
          cardType = null
        }
      }
      return (
        <span>
          <span style={{opacity: !cardType || cardType === 'Visa' ? 1 : 0.4}}>
            <PSPIcons.Visa />
          </span>
          <span style={{display: 'inline-block', width: 10}} />
          <span style={{opacity: !cardType || cardType === 'MasterCard' ? 1 : 0.4}}>
            <PSPIcons.Mastercard />
          </span>
        </span>
      )
    }
  },
  {
    disabled: false,
    key: 'POSTFINANCECARD',
    bgColor: '#FCCC12',
    Icon: PSPIcons.Postcard
  },
  {
    disabled: false,
    key: 'PAYMENTSLIP'
  },
  {
    disabled: false,
    key: 'PAYPAL',
    Icon: PSPIcons.PayPal
  }
]

const styles = {
  secure: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 14,
    color: colors.primary,
    marginBottom: 20,
    marginTop: 10,
    '& svg': {
      marginRight: 5
    }
  }),
  paymentMethod: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 14,
    color: '#000',
    display: 'inline-block',
    border: `1px solid ${colors.secondary}`,
    padding: 10,
    cursor: 'pointer',
    marginRight: 10,
    marginBottom: 10,
    lineHeight: 0,
    height: 62,
    verticalAlign: 'top',

    '& input': {
      display: 'none'
    }
  }),
  paymentMethodTextOnly: css({
    lineHeight: '40px'
  }),
  paymentMethodTextWithIcon: css({
    position: 'absolute',
    left: -10000,
    top: 'auto'
  })
}

const {H2, P} = Interaction

class PaymentForm extends Component {
  constructor (...args) {
    super(...args)
    this.state = {}
    this.postFinanceFormRef = (ref) => {
      this.postFinanceForm = ref
    }
    this.payPalFormRef = (ref) => {
      this.payPalForm = ref
    }
  }
  render () {
    const {
      t,
      allowedMethods,
      payload,
      values,
      errors,
      dirty,
      onChange
    } = this.props
    const { paymentMethod } = values

    return (
      <div>
        <H2>{t('pledge/submit/payMethod/title')}</H2>
        <div {...styles.secure}>
          <LockIcon /> {t('pledge/submit/secure')}
        </div>
        <P>
          <Label>{t('pledge/submit/payMethod/label')}</Label><br />
          {PAYMENT_METHODS
            .filter(pm => !pm.disabled && (!allowedMethods || allowedMethods.indexOf(pm.key) !== -1))
            .map((pm) => (
              <label key={pm.key}
                {...styles.paymentMethod}
                style={{
                  backgroundColor: pm.bgColor,
                  opacity: allowedMethods && paymentMethod === pm.key ? 1 : 0.4
                }}>
                <input
                  type='radio'
                  name='paymentMethod'
                  disabled={!allowedMethods || pm.disabled}
                  onChange={(event) => {
                    event.preventDefault()
                    const value = event.target.value

                    onChange({
                      values: {
                        paymentMethod: value
                      }
                    })
                  }}
                  value={pm.key}
                  checked={paymentMethod === pm.key} />
                {pm.Icon ? <pm.Icon state={this.state} values={values} /> : null}
                <span {...(pm.Icon
                  ? styles.paymentMethodTextWithIcon
                  : styles.paymentMethodTextOnly
                )}>
                  {t(`pledge/submit/pay/method/${pm.key}`)}
                </span>
              </label>
            ))}
        </P>
        {(paymentMethod === 'PAYMENTSLIP') && (
          <div>
            <Label>
              {t('pledge/submit/paymentslip/explanation')}
            </Label><br /><br />
            <Label>{t('pledge/submit/paymentslip/title')}</Label>
            <AddressForm
              values={values}
              errors={errors}
              dirty={dirty}
              onChange={onChange} />
            <br />
            { /* <div style={{marginBottom: 5}}>
              <Radio
                checked={!values.paperInvoice}
                onChange={() => {
                  onChange({
                    values: {
                      paperInvoice: false
                    }
                  })
                }}>
                {t('pledge/submit/paymentslip/emailInvoice')}
              </Radio>
            </div>
            <div>
              <Radio
                checked={!!values.paperInvoice}
                onChange={() => {
                  onChange({
                    values: {
                      paperInvoice: true
                    }
                  })
                }}>
                {t('pledge/submit/paymentslip/paperInvoice')}
              </Radio>
            </div> */ }
            <br />
          </div>
        )}
        {(paymentMethod === 'STRIPE') && (
          <form method='post' onSubmit={(e) => {
            e.preventDefault()
          }}>
            <Label>{t('pledge/submit/stripe/prefered')}</Label>
            <FieldSet
              values={values}
              errors={errors}
              dirty={dirty}
              fields={[
                {
                  label: t('pledge/submit/stripe/card/label'),
                  name: 'cardNumber',
                  autoComplete: 'cc-number',
                  mask: '1111 1111 1111 1111',
                  validator: (value) => (
                    (
                      !value &&
                      t('pledge/submit/stripe/card/error/empty')
                    ) || (
                      !!this.state.stripe &&
                      !this.state.stripe.card.validateCardNumber(value) &&
                      t('pledge/submit/stripe/card/error/invalid')
                    )
                  )
                },
                {
                  label: t('pledge/submit/stripe/month/label'),
                  name: 'cardMonth',
                  autoComplete: 'cc-exp-month'
                },
                {
                  label: t('pledge/submit/stripe/year/label'),
                  name: 'cardYear',
                  autoComplete: 'cc-exp-year'
                },
                {
                  label: t('pledge/submit/stripe/cvc/label'),
                  name: 'cardCVC',
                  autoComplete: 'cc-csc',
                  validator: (value) => (
                    (
                      !value &&
                      t('pledge/submit/stripe/cvc/error/empty')
                    ) || (
                      !!this.state.stripe &&
                      !this.state.stripe.card.validateCVC(value) &&
                      t('pledge/submit/stripe/cvc/error/invalid')
                    )
                  )
                }
              ]}
              onChange={(fields, mounting) => {
                if (
                  (!mounting || values.cardNumber) &&
                  !this.state.stripe
                ) {
                  onChange({
                    errors: {
                      stripe: t('pledge/submit/stripe/js/loading')
                    }
                  })
                  if (this.state.loadingStripe) {
                    return
                  }
                  this.setState(() => ({
                    loadingStripe: true
                  }))
                  loadStripe()
                    .then(stripe => {
                      this.setState(() => ({
                        loadingStripe: false,
                        stripe
                      }))
                      onChange({
                        errors: {
                          stripe: undefined
                        }
                      })
                    })
                    .catch(() => {
                      this.setState(() => ({
                        loadingStripe: false
                      }))
                      onChange({
                        errors: {
                          stripe: t('pledge/submit/stripe/js/failed')
                        }
                      })
                    })
                }

                const nextState = FieldSet.utils.mergeFields(fields)({
                  values,
                  errors,
                  dirty
                })
                const month = nextState.values.cardMonth
                const year = nextState.values.cardYear

                if (
                  year && month &&
                  nextState.dirty.cardMonth &&
                  nextState.dirty.cardYear &&
                  !!this.state.stripe &&
                  !this.state.stripe.card.validateExpiry(month, year)
                ) {
                  nextState.errors.cardMonth = t('pledge/submit/stripe/month/error/invalid')
                  nextState.errors.cardYear = t('pledge/submit/stripe/year/error/invalid')
                } else {
                  nextState.errors.cardMonth = (
                    !month && t('pledge/submit/stripe/month/error/empty')
                  )
                  nextState.errors.cardYear = (
                    !year && t('pledge/submit/stripe/year/error/empty')
                  )
                }
                onChange(nextState)
              }} />
            <br /><br />
          </form>
        )}
        {(paymentMethod === 'POSTFINANCECARD') && (
          <form ref={this.postFinanceFormRef} method='post' action={PF_FORM_ACTION}>
            {
              postfinance.getParams({
                userId: payload.userId,
                orderId: payload.id,
                amount: payload.total,
                alias: payload.pfAliasId,
                sha: payload.pfSHA
              }).map(param => (
                <input key={param.key}
                  type='hidden'
                  name={param.key}
                  value={param.value} />
              ))
            }
          </form>
        )}
        {(paymentMethod === 'PAYPAL') && (
          <form ref={this.payPalFormRef} method='post' action={PAYPAL_FORM_ACTION}>
            {
              paypal.getParams({
                itemName: payload.id,
                amount: payload.total
              }).map(param => (
                <input key={param.key}
                  type='hidden'
                  name={param.key}
                  value={param.value} />
              ))
            }
          </form>
        )}
      </div>
    )
  }
}

PaymentForm.propTypes = {
  t: PropTypes.func.isRequired,
  allowedMethods: PropTypes.arrayOf(
    PropTypes.oneOf(PAYMENT_METHODS.map(method => method.key))
  ),
  payload: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    total: PropTypes.number,
    pfAliasId: PropTypes.string,
    pfSHA: PropTypes.string
  }).isRequired
  // return: PropTypes.shape({
  //   route: PropTypes.string.isRequired,
  //   params: PropTypes.object
  // }).isRequired,
  // onPay: PropTypes.func.isRequired
  // get: method, sourceId, pspPayload
}

// look into PARAMPLUS for PF
// https://e-payment-postfinance.v-psp.com/~/media/kdb/pdf/postfinance/en/123ae0b9-2864-48d4-9b06-7ed2d70db029/e-commerce.ashx
// something for paypal

// export const withPayment = Component => Component

// pay (context)
// payment
// - pay
// - errors
// - receiveError
// - context

export default PaymentForm
