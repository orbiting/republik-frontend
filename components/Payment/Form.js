import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Interaction, Label,
  colors, fontFamilies,
  Loader
} from '@project-r/styleguide'

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

import { format } from 'd3-format'

const pad2 = format('02')

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

const PAYMENT_METHOD_HEIGHT = 64

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
    height: PAYMENT_METHOD_HEIGHT - 2, // 2px borders
    padding: 10,
    cursor: 'pointer',
    marginRight: 10,
    marginBottom: 10,
    lineHeight: 0,
    verticalAlign: 'top',
    '& input': {
      display: 'none'
    }
  }),
  paymentMethodText: css({
    lineHeight: '40px',
    verticalAlign: 'middle'
  }),
  paymentMethodSourceText: css({
    display: 'inline-block',
    paddingLeft: 15,
    paddingRight: 10,
    lineHeight: '20px',
    verticalAlign: 'middle'
  }),
  paymentMethodHiddenText: css({
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
  componentDidMount () {
    this.autoSelect()
  }
  componentDidUpdate () {
    this.autoSelect()
  }
  autoSelect () {
    const {
      paymentSources,
      loadingPaymentSources,
      allowedMethods,
      values,
      onChange
    } = this.props
    if (!loadingPaymentSources && !values.paymentMethod) {
      const chargablePaymentSource =
        paymentSources &&
        paymentSources.find(ps => (
          ps.status === 'CHARGEABLE' && ps.isDefault
        ))
      if (chargablePaymentSource) {
        onChange({
          values: {
            paymentMethod: 'STRIPE',
            paymentSource: chargablePaymentSource.id
          }
        })
      } else {
        onChange({
          values: {
            paymentMethod: allowedMethods.indexOf('STRIPE') !== -1
              ? 'STRIPE'
              : allowedMethods[0],
            paymentSource: undefined
          }
        })
      }
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
      onChange,
      paymentSources,
      loadingPaymentSources
    } = this.props
    const { paymentMethod } = values

    const paymentMethodForm = !values.paymentSource && paymentMethod

    return (
      <div>
        <H2>{t('pledge/submit/payMethod/title')}</H2>
        <div {...styles.secure}>
          <LockIcon /> {t('pledge/submit/secure')}
        </div>
        <Loader style={{minHeight: (PAYMENT_METHOD_HEIGHT + 20) * 2}} loading={loadingPaymentSources} render={() => {
          const chargablePaymentSources =
            paymentSources &&
            paymentSources.filter(ps => (
              ps.status === 'CHARGEABLE' && ps.isDefault
            ))

          return (
            <P>
              {!!chargablePaymentSources && (
                <Fragment>
                  <Label>{t('payment/method/existing')}</Label><br />
                  {chargablePaymentSources.map((paymentSource, i) => {
                    const Icon = (
                      (paymentSource.brand === 'Visa' && <PSPIcons.Visa />) ||
                      (paymentSource.brand === 'MasterCard' && <PSPIcons.Mastercard />)
                    )

                    const disabled = paymentSource.status !== 'CHARGEABLE'
                    const color = disabled
                      ? colors.error
                      : undefined

                    return (
                      <label key={i}
                        {...styles.paymentMethod}
                        style={{
                          opacity: values.paymentSource === paymentSource.id
                            ? 1
                            : 0.4,
                          borderColor: color,
                          color
                        }}>
                        <input
                          type='radio'
                          name='paymentMethod'
                          disabled={disabled}
                          onChange={(event) => {
                            event.preventDefault()
                            const value = event.target.value
                            onChange({
                              values: {
                                paymentMethod: 'STRIPE',
                                paymentSource: value
                              }
                            })
                          }}
                          value={paymentSource.id}
                          checked={values.paymentSource === paymentSource.id} />
                        {Icon && Icon}
                        {Icon && <span {...styles.paymentMethodHiddenText}>
                          {paymentSource.brand}
                        </span>}
                        <span {...styles.paymentMethodSourceText}>
                          {!Icon && paymentSource.brand}
                          {'**** '}
                          {paymentSource.last4}
                          <br />
                          {pad2(paymentSource.expMonth)}
                          /
                          {paymentSource.expYear}
                        </span>
                      </label>
                    )
                  })}
                  <br />
                </Fragment>
              )}
              <Label>
                {t(chargablePaymentSources ? 'payment/method/new' : 'payment/method/choose')}
              </Label><br />
              {PAYMENT_METHODS
                .filter(pm => (
                  !pm.disabled &&
                  (!allowedMethods || allowedMethods.indexOf(pm.key) !== -1)
                ))
                .map((pm) => (
                  <label key={pm.key}
                    {...styles.paymentMethod}
                    style={{
                      backgroundColor: pm.bgColor,
                      opacity: allowedMethods && paymentMethod === pm.key && !values.paymentSource
                        ? 1 : 0.4
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
                            paymentMethod: value,
                            paymentSource: undefined
                          }
                        })
                      }}
                      value={pm.key}
                      checked={paymentMethod === pm.key && !values.paymentSource} />
                    {pm.Icon ? <pm.Icon state={this.state} values={values} /> : null}
                    <span {...(pm.Icon
                      ? styles.paymentMethodHiddenText
                      : styles.paymentMethodText
                    )}>
                      {t(`pledge/submit/pay/method/${pm.key}`)}
                    </span>
                  </label>
                ))}
            </P>
          )
        }} />
        {(paymentMethodForm === 'PAYMENTSLIP') && (
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
        {(paymentMethodForm === 'STRIPE') && (
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
        {(paymentMethodForm === 'POSTFINANCECARD') && (
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
        {(paymentMethodForm === 'PAYPAL') && (
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

const myPaymentSources = gql`
query {
  me {
    id
    paymentSources {
      id
      status
      brand
      last4
      expMonth
      expYear
      isDefault
    }
  }
}
`

// all HOCs must support getWrappedInstance here
export default compose(
  graphql(myPaymentSources, {
    skip: props => !props.me,
    withRef: true,
    options: {
      fetchPolicy: 'network-only',
      ssr: false
    },
    props: ({data}) => ({
      paymentSources: data.me && data.me.paymentSources,
      loadingPaymentSources: data.loading
    })
  })
)(PaymentForm)
