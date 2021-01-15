import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Interaction,
  Label,
  A,
  fontFamilies,
  Loader,
  useColorContext,
  Checkbox,
  Radio,
  colors
} from '@project-r/styleguide'

import FieldSet from '../FieldSet'

import { AutoForm as AddressForm, AddressView } from '../Account/AddressForm'

import { PF_FORM_ACTION, PAYPAL_FORM_ACTION } from '../../lib/constants'

import { inNativeAppBrowser } from '../../lib/withInNativeApp'

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
    Icon: ({ state: { stripe }, values }) => {
      let cardType = null
      if (stripe && values && values.cardNumber) {
        cardType = stripe.card.cardType(values.cardNumber)
        if (cardType === 'Unknown') {
          cardType = null
        }
      }
      return (
        <span>
          <span style={{ opacity: !cardType || cardType === 'Visa' ? 1 : 0.4 }}>
            <PSPIcons.Visa />
          </span>
          <span style={{ display: 'inline-block', width: 10 }} />
          <span
            style={{
              opacity: !cardType || cardType === 'MasterCard' ? 1 : 0.4
            }}
          >
            <PSPIcons.Mastercard />
          </span>
        </span>
      )
    }
  },
  {
    disabled: inNativeAppBrowser,
    key: 'POSTFINANCECARD',
    bgColor: '#FCCC12',
    Icon: PSPIcons.Postcard
  },
  {
    disabled: false,
    key: 'PAYMENTSLIP'
  },
  {
    disabled: inNativeAppBrowser,
    key: 'PAYPAL',
    Icon: PSPIcons.PayPal
  }
]

const PAYMENT_METHOD_HEIGHT = 64

const styles = {
  secure: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 14,
    marginBottom: 20,
    marginTop: 10,
    '& svg': {
      marginRight: 5,
      marginBottom: -2
    }
  }),
  paymentMethod: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontSize: 14,
    display: 'inline-block',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
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
    verticalAlign: 'middle',
    color: colors.light.text
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

const PaymentMethodLabel = ({ backgroundColor, active, error, children }) => {
  const [colorScheme] = useColorContext()
  return (
    <label
      {...styles.paymentMethod}
      {...colorScheme.set('borderColor', error ? 'error' : 'text')}
      {...colorScheme.set('color', error ? 'error' : 'text')}
      style={{
        backgroundColor,
        opacity: active ? 1 : 0.4
      }}
    >
      {children}
    </label>
  )
}

const { H2, P } = Interaction

class PaymentForm extends Component {
  constructor(...args) {
    super(...args)
    this.state = {}
    this.postFinanceFormRef = ref => {
      this.postFinanceForm = ref
    }
    this.payPalFormRef = ref => {
      this.payPalForm = ref
    }
  }
  componentDidMount() {
    this.autoSelect()
  }
  componentDidUpdate() {
    this.autoSelect()
  }
  autoSelect() {
    const {
      paymentSources,
      loadingPaymentSources,
      allowedMethods,
      values,
      onChange
    } = this.props
    if (
      !loadingPaymentSources &&
      (!values.paymentMethod ||
        (allowedMethods && allowedMethods.indexOf(values.paymentMethod) === -1))
    ) {
      const chargablePaymentSource =
        paymentSources &&
        paymentSources.find(
          ps => ps.status === 'CHARGEABLE' && ps.isDefault && !ps.isExpired
        )
      const stripeAllowed = allowedMethods
        ? allowedMethods.indexOf('STRIPE') !== -1
        : true
      if (chargablePaymentSource && stripeAllowed) {
        onChange({
          values: {
            paymentMethod: 'STRIPE',
            paymentSource: chargablePaymentSource.id
          }
        })
      } else {
        onChange({
          values: {
            paymentMethod: stripeAllowed ? 'STRIPE' : allowedMethods[0],
            paymentSource: undefined,
            newSource: true
          }
        })
      }
    }
  }
  createStripeSource({ total, metadata, on3DSecure, returnUrl }) {
    const { values, t } = this.props
    return loadStripe().then(stripe => {
      return new Promise((resolve, reject) => {
        stripe.source.create(
          {
            type: 'card',
            currency: 'CHF',
            amount: total,
            usage: 'reusable',
            card: {
              number: values.cardNumber && values.cardNumber.trim(),
              cvc: values.cardCVC && values.cardCVC.trim(),
              exp_month: +values.cardMonth,
              exp_year: +values.cardYear
            },
            metadata
          },
          (status, source) => {
            if (status !== 200) {
              // source.error.type
              // source.error.param
              // source.error.message
              // see https://stripe.com/docs/api#errors
              // - never happens because we use client validation
              // - only when charging some additional errors can happen
              //   those are handled server side in the pay mutation
              // - if it happens, we simply display the English message
              // test cards https://stripe.com/docs/testing#cards
              reject(source.error.message)
              return
            }

            if (source.card.three_d_secure !== 'required') {
              resolve(source)
              return
            }

            if (on3DSecure) {
              on3DSecure()
            }
            stripe.source.create(
              {
                type: 'three_d_secure',
                currency: 'CHF',
                amount: total || 24000,
                three_d_secure: {
                  card: source.id
                },
                redirect: {
                  return_url: returnUrl
                },
                metadata
              },
              (status, source3d) => {
                if (status !== 200) {
                  reject(
                    t.first([
                      `payment/stripe/${source3d.error.code}`,
                      'payment/stripe/unkown'
                    ])
                  )
                  return
                }
                if (source3d.redirect.status === 'succeeded') {
                  // can charge immediately
                  resolve(source3d)
                } else if (source3d.redirect.status === 'failed') {
                  // no support or bank 3D Secure down
                  reject(t('payment/stripe/redirect/failed'))
                } else {
                  window.location = source3d.redirect.url
                }
              }
            )
          }
        )
      })
    })
  }
  render() {
    const {
      t,
      allowedMethods,
      payload,
      values,
      errors,
      dirty,
      onChange,
      paymentSources,
      loadingPaymentSources,
      onlyChargable,
      addressState,
      shippingAddressState,
      context,
      requireShippingAddress,
      userName,
      userAddress,
      packageGroup,
      syncAddresses,
      setSyncAddresses
    } = this.props
    const { paymentMethod } = values
    const visibleMethods = allowedMethods || PAYMENT_METHODS.map(pm => pm.key)

    const hasChoice = visibleMethods.length > 1
    const onlyStripe = !hasChoice && visibleMethods[0] === 'STRIPE'
    const stripeNote = t.first(
      [
        context &&
          `payment/stripe/${onlyStripe ? 'only' : 'prefered'}/${context}`,
        `payment/stripe/${onlyStripe ? 'only' : 'prefered'}`
      ].filter(Boolean),
      undefined,
      ''
    )

    const paymentMethodForm = !values.paymentSource && paymentMethod

    return (
      <div>
        {requireShippingAddress && (
          <div style={{ marginBottom: 40 }}>
            <H2 style={{ marginBottom: 10 }}>
              {t('pledge/address/shipping/title')}
            </H2>
            <AddressForm
              {...shippingAddressState}
              afterEdit={
                userAddress || packageGroup === 'GIVE' ? (
                  <>
                    <Checkbox
                      checked={syncAddresses}
                      onChange={(_, checked) => {
                        setSyncAddresses(checked)
                      }}
                    >
                      {t(
                        `pledge/address/shipping/${
                          userAddress ? 'updateAccount' : 'setAccount'
                        }`
                      )}
                    </Checkbox>
                    <br style={{ clear: 'left' }} />
                  </>
                ) : (
                  undefined
                )
              }
              existingAddress={userAddress}
              name={userName}
            />
          </div>
        )}
        <H2>
          {t.first(
            [
              context &&
                `payment/title${!hasChoice ? '/single' : ''}/${context}`,
              `payment/title${!hasChoice ? '/single' : ''}`
            ].filter(Boolean)
          )}
        </H2>
        <div {...styles.secure}>
          <LockIcon /> {t('payment/secure')}
        </div>
        <Loader
          style={{ minHeight: PAYMENT_METHOD_HEIGHT * 2 }}
          loading={loadingPaymentSources}
          render={() => {
            const visiblePaymentSources = paymentSources
              ? paymentSources.filter(
                  ps =>
                    (!onlyChargable ||
                      (ps.status === 'CHARGEABLE' && !ps.isExpired)) &&
                    ps.isDefault
                )
              : []
            const hasVisiblePaymentSources = !!visiblePaymentSources.length

            const showMethods = !hasVisiblePaymentSources || values.newSource

            return (
              <P>
                {hasVisiblePaymentSources && (
                  <Fragment>
                    <Label>{t('payment/method/existing')}</Label>
                    <br />
                    {visiblePaymentSources.map((paymentSource, i) => {
                      const Icon =
                        (paymentSource.brand === 'Visa' && <PSPIcons.Visa />) ||
                        (paymentSource.brand === 'MasterCard' && (
                          <PSPIcons.Mastercard />
                        ))

                      const disabled = paymentSource.status !== 'CHARGEABLE'

                      return (
                        <PaymentMethodLabel
                          key={i}
                          active={values.paymentSource === paymentSource.id}
                          error={disabled}
                        >
                          <input
                            type='radio'
                            name='paymentMethod'
                            disabled={disabled}
                            onChange={event => {
                              event.preventDefault()
                              const value = event.target.value
                              onChange({
                                values: {
                                  newSource: false,
                                  paymentMethod: 'STRIPE',
                                  paymentSource: value
                                }
                              })
                            }}
                            value={paymentSource.id}
                            checked={values.paymentSource === paymentSource.id}
                          />
                          {Icon && Icon}
                          {Icon && (
                            <span {...styles.paymentMethodHiddenText}>
                              {paymentSource.brand}
                            </span>
                          )}
                          <span {...styles.paymentMethodSourceText}>
                            {!Icon && paymentSource.brand}
                            {'**** '}
                            {paymentSource.last4}
                            <br />
                            {pad2(paymentSource.expMonth)}/
                            {paymentSource.expYear}
                          </span>
                        </PaymentMethodLabel>
                      )
                    })}
                    <br />
                  </Fragment>
                )}
                {!hasVisiblePaymentSources && hasChoice && (
                  <Label>{t('payment/method/choose')}</Label>
                )}
                {hasVisiblePaymentSources && !showMethods && (
                  <Label>
                    <A
                      href='#show'
                      onClick={e => {
                        e.preventDefault()
                        onChange({
                          values: {
                            newSource: true,
                            paymentSource: undefined
                          }
                        })
                      }}
                    >
                      {t(`payment/method/new${onlyStripe ? '/stripe' : ''}`)}
                    </A>
                  </Label>
                )}
                {hasVisiblePaymentSources && showMethods && (
                  <Label>
                    {t(`payment/method/new${onlyStripe ? '/stripe' : ''}`)}
                  </Label>
                )}
                {(hasChoice || hasVisiblePaymentSources) && <br />}
                {showMethods &&
                  PAYMENT_METHODS.filter(
                    pm => !pm.disabled && visibleMethods.indexOf(pm.key) !== -1
                  ).map(pm => (
                    <PaymentMethodLabel
                      key={pm.key}
                      backgroundColor={pm.bgColor}
                      active={paymentMethod === pm.key && !values.paymentSource}
                    >
                      <input
                        type='radio'
                        name='paymentMethod'
                        disabled={pm.disabled}
                        onChange={event => {
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
                        checked={
                          paymentMethod === pm.key && !values.paymentSource
                        }
                      />
                      {pm.Icon ? (
                        <pm.Icon state={this.state} values={values} />
                      ) : null}
                      <span
                        {...(pm.Icon
                          ? styles.paymentMethodHiddenText
                          : styles.paymentMethodText)}
                      >
                        {t(`payment/method/${pm.key}`)}
                      </span>
                    </PaymentMethodLabel>
                  ))}
              </P>
            )
          }}
        />
        {paymentMethodForm === 'PAYMENTSLIP' && (
          <div>
            <Label>{t('payment/paymentslip/explanation')}</Label>
            <br />
            <br />
            <div style={{ marginBottom: 10 }}>
              <Label>{t('pledge/address/payment/title')}</Label>
            </div>
            {requireShippingAddress && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ marginBottom: 5 }}>
                  <Radio
                    checked={syncAddresses}
                    onChange={() => {
                      setSyncAddresses(true)
                    }}
                  >
                    {t('pledge/address/payment/likeShipping')}
                  </Radio>
                </div>
                <div>
                  <Radio
                    checked={!syncAddresses}
                    onChange={() => {
                      setSyncAddresses(false)
                    }}
                  >
                    {t('pledge/address/payment/other')}
                  </Radio>
                </div>
              </div>
            )}
            {syncAddresses ? (
              shippingAddressState.isValid && (
                <AddressView values={shippingAddressState.values} />
              )
            ) : (
              <AddressForm
                {...addressState}
                existingAddress={
                  requireShippingAddress ? undefined : userAddress
                }
                name={userName}
              />
            )}
            {/* <div style={{marginBottom: 5}}>
              <Radio
                checked={!values.paperInvoice}
                onChange={() => {
                  onChange({
                    values: {
                      paperInvoice: false
                    }
                  })
                }}>
                {t('payment/paymentslip/emailInvoice')}
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
                {t('payment/paymentslip/paperInvoice')}
              </Radio>
            </div> */}
          </div>
        )}
        {paymentMethodForm === 'STRIPE' && (
          <form
            method='post'
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            {stripeNote && <Label>{stripeNote}</Label>}
            <FieldSet
              values={values}
              errors={errors}
              dirty={dirty}
              fields={[
                {
                  label: t('payment/stripe/card/label'),
                  name: 'cardNumber',
                  autoComplete: 'cc-number',
                  mask: '1111 1111 1111 1111',
                  validator: value =>
                    (!value && t('payment/stripe/card/error/empty')) ||
                    (!!this.state.stripe &&
                      !this.state.stripe.card.validateCardNumber(value) &&
                      t('payment/stripe/card/error/invalid'))
                },
                {
                  label: t('payment/stripe/month/label'),
                  name: 'cardMonth',
                  autoComplete: 'cc-exp-month'
                },
                {
                  label: t('payment/stripe/year/label'),
                  name: 'cardYear',
                  autoComplete: 'cc-exp-year'
                },
                {
                  label: t('payment/stripe/cvc/label'),
                  name: 'cardCVC',
                  autoComplete: 'cc-csc',
                  validator: value =>
                    (!value && t('payment/stripe/cvc/error/empty')) ||
                    (!!this.state.stripe &&
                      !this.state.stripe.card.validateCVC(value) &&
                      t('payment/stripe/cvc/error/invalid'))
                }
              ]}
              onChange={(fields, mounting) => {
                if ((!mounting || values.cardNumber) && !this.state.stripe) {
                  onChange({
                    errors: {
                      stripe: t('payment/stripe/js/loading')
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
                          stripe: t('payment/stripe/js/failed')
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
                  year &&
                  month &&
                  nextState.dirty.cardMonth &&
                  nextState.dirty.cardYear &&
                  !!this.state.stripe &&
                  !this.state.stripe.card.validateExpiry(month, year)
                ) {
                  nextState.errors.cardMonth = t(
                    'payment/stripe/month/error/invalid'
                  )
                  nextState.errors.cardYear = t(
                    'payment/stripe/year/error/invalid'
                  )
                } else {
                  nextState.errors.cardMonth =
                    !month && t('payment/stripe/month/error/empty')
                  nextState.errors.cardYear =
                    !year && t('payment/stripe/year/error/empty')
                }
                onChange(nextState)
              }}
            />
          </form>
        )}
        {paymentMethodForm === 'POSTFINANCECARD' && (
          <form
            ref={this.postFinanceFormRef}
            method='post'
            action={PF_FORM_ACTION}
          >
            {postfinance
              .getParams({
                userId: payload.userId,
                orderId: payload.id,
                amount: payload.total,
                alias: payload.pfAliasId,
                sha: payload.pfSHA
              })
              .map(param => (
                <input
                  key={param.key}
                  type='hidden'
                  name={param.key}
                  value={param.value || ''}
                />
              ))}
          </form>
        )}
        {paymentMethodForm === 'PAYPAL' && (
          <form
            ref={this.payPalFormRef}
            method='post'
            action={PAYPAL_FORM_ACTION}
          >
            {paypal
              .getParams({
                itemName: payload.id,
                amount: payload.total
              })
              .map(param => (
                <input
                  key={param.key}
                  type='hidden'
                  name={param.key}
                  value={param.value || ''}
                />
              ))}
          </form>
        )}
      </div>
    )
  }
}

PaymentForm.propTypes = {
  t: PropTypes.func.isRequired,
  loadSources: PropTypes.bool.isRequired,
  accessToken: PropTypes.string,
  allowedMethods: PropTypes.arrayOf(
    PropTypes.oneOf(PAYMENT_METHODS.map(method => method.key))
  ),
  payload: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    total: PropTypes.number,
    pfAliasId: PropTypes.string,
    pfSHA: PropTypes.string
  }).isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  dirty: PropTypes.object.isRequired
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

export const query = gql`
  query myPaymentSources($accessToken: ID) {
    me(accessToken: $accessToken) {
      id
      paymentSources {
        id
        status
        brand
        last4
        expMonth
        expYear
        isDefault
        isExpired
      }
    }
  }
`

// all HOCs must support getWrappedInstance here
export default compose(
  graphql(query, {
    skip: props => !props.loadSources,
    withRef: true,
    options: ({ accessToken }) => ({
      fetchPolicy: 'network-only',
      ssr: false,
      variables: { accessToken }
    }),
    props: ({ data }) => ({
      paymentSources: data.me && data.me.paymentSources,
      loadingPaymentSources: data.loading
    })
  })
)(PaymentForm)
