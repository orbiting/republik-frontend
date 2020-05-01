import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import SignIn, { withSignIn } from '../Auth/SignIn'
import { withSignOut } from '../Auth/SignOut'

import { errorToString } from '../../lib/utils/errors'
import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import { chfFormat } from '../../lib/utils/format'
import track from '../../lib/piwik'

import { gotoMerci, encodeSignInResponseQuery } from './Merci'

import { COUNTRIES, fields as getAddressFields } from '../Account/AddressForm'
import { query as addressQuery } from '../Account/enhancers'

import FieldSet from '../FieldSet'

import { PUBLIC_BASE_URL } from '../../lib/constants'

import {
  Interaction,
  Button,
  Checkbox,
  colors,
  InlineSpinner,
  Label
} from '@project-r/styleguide'

import PaymentForm from '../Payment/Form'
import { STRIPE_PLEDGE_ID_QUERY_KEY } from '../Payment/constants'
import Consents, { getConsentsError } from './Consents'

const { P } = Interaction

const objectValues = object => Object.keys(object).map(key => object[key])
const simpleHash = (object, delimiter = '|') => {
  return objectValues(object)
    .map(value => {
      if (value && typeof value === 'object') {
        return simpleHash(value, delimiter === '|' ? '$' : `$${delimiter}`)
      }
      return `${value}`
    })
    .join(delimiter)
}

const getRequiredConsents = ({ requiresStatutes }) =>
  ['PRIVACY', 'TOS', requiresStatutes && 'STATUTE'].filter(Boolean)

class Submit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emailVerify: false,
      consents: [],
      values: {
        country: COUNTRIES[0],
        name: [props.user.firstName, props.user.lastName]
          .filter(Boolean)
          .join(' '),
        ...(props.customMe && props.customMe.address)
      },
      errors: {},
      dirty: {},
      loading: false
    }
    if (props.basePledge) {
      const variables = this.submitVariables(props.basePledge)
      const hash = simpleHash(variables)

      setPendingOrder(variables)

      this.state.pledgeHash = hash
      this.state.pledgeId = props.basePledge.id
    }
    this.paymentRef = ref => {
      this.payment =
        ref && ref.getWrappedInstance ? ref.getWrappedInstance() : ref
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dirty, values } = this.state
    const prevName = [this.props.user.firstName, this.props.user.lastName]
      .filter(Boolean)
      .join(' ')
    const nextName = [nextProps.user.firstName, nextProps.user.lastName]
      .filter(Boolean)
      .join(' ')
    const addressFields = getAddressFields(this.props.t)
    if (
      nextName !== values.name &&
      (!dirty.name || !(values.name || '').trim() || values.name === prevName)
    ) {
      this.setState(state => {
        const values = {
          ...state.values,
          name: nextName
        }
        return {
          values,
          errors: {
            ...state.errors,
            ...(values.paymentMethod === 'PAYMENTSLIP'
              ? FieldSet.utils.getErrors(addressFields, values)
              : {})
          }
        }
      })
    }

    const addressDirty = addressFields.find(field => dirty[field.name])
    if (!addressDirty) {
      const nextAddress =
        (nextProps.customMe && nextProps.customMe.address) ||
        addressFields.reduce((values, field) => {
          values[field.name] = field.name === 'name' ? nextName : ''
          return values
        }, {})
      if (
        nextAddress !== (this.props.customMe && this.props.customMe.address)
      ) {
        this.setState(state => {
          const values = {
            ...state.values,
            ...nextAddress
          }
          return {
            values,
            errors: {
              ...state.errors,
              ...(values.paymentMethod === 'PAYMENTSLIP'
                ? FieldSet.utils.getErrors(addressFields, values)
                : {})
            }
          }
        })
      }
    }
  }
  submitVariables(props) {
    const { user, total, options, reason, accessToken, customMe } = props

    return {
      total,
      options: options.map(option => ({
        ...option,
        autoPay:
          option.autoPay !== undefined ? this.getAutoPayValue() : undefined
      })),
      reason,
      user,
      accessToken:
        customMe && customMe.isUserOfCurrentSession ? undefined : accessToken
    }
  }
  withoutAddress() {
    const { customMe } = this.props
    return customMe && customMe.hasAddress && !customMe.isUserOfCurrentSession
  }
  submitPledge() {
    const { t, customMe } = this.props
    const errorMessages = this.getErrorMessages()

    if (errorMessages.length) {
      this.props.onError()
      this.setState(state => {
        const dirty = {
          ...state.dirty
        }
        Object.keys(state.errors).forEach(field => {
          if (state.errors[field]) {
            dirty[field] = true
          }
        })
        return {
          dirty,
          showErrors: true
        }
      })
      return
    }

    const variables = this.submitVariables(this.props)
    if (customMe && customMe.email !== variables.user.email) {
      this.props.signOut().then(() => {
        this.submitPledge()
      })
      return
    }

    const hash = simpleHash(variables)

    if (
      !this.state.submitError &&
      this.state.pledgeHash === hash &&
      // Special Case: POSTFINANCECARD
      // - we need a pledgeResponse with pfAliasId and pfSHA
      // - this can be missing if returning from a PSP redirect
      // - in those cases we create a new pledge
      (this.state.values.paymentMethod !== 'POSTFINANCECARD' ||
        this.state.pledgeResponse)
    ) {
      this.payPledge(this.state.pledgeId, this.state.pledgeResponse)
      return
    }

    this.setState(() => ({
      loading: t('pledge/submit/loading/submit')
    }))
    this.props
      .submit({
        ...variables,
        consents: getRequiredConsents(this.props)
      })
      .then(({ data }) => {
        if (data.submitPledge.emailVerify) {
          this.setState(() => ({
            loading: false,
            emailVerify: true
          }))
          return
        }
        this.setState(() => ({
          loading: false,
          pledgeId: data.submitPledge.pledgeId,
          pledgeHash: hash,
          pledgeResponse: data.submitPledge,
          submitError: undefined
        }))
        this.payPledge(data.submitPledge.pledgeId, data.submitPledge)
      })
      .catch(error => {
        const submitError = errorToString(error)

        this.setState(() => ({
          loading: false,
          pledgeId: undefined,
          pledgeHash: undefined,
          submitError
        }))
      })
  }
  payPledge(pledgeId, pledgeResponse) {
    const { paymentMethod } = this.state.values

    if (paymentMethod === 'PAYMENTSLIP') {
      this.payWithPaymentSlip(pledgeId)
    } else if (paymentMethod === 'POSTFINANCECARD') {
      this.payWithPostFinance(pledgeId, pledgeResponse)
    } else if (paymentMethod === 'STRIPE') {
      this.payWithStripe(pledgeId)
    } else if (paymentMethod === 'PAYPAL') {
      this.payWithPayPal(pledgeId)
    }
  }
  payWithPayPal(pledgeId) {
    const { t } = this.props

    this.setState(
      () => ({
        loading: t('pledge/submit/loading/paypal'),
        pledgeId: pledgeId
      }),
      () => {
        this.payment.payPalForm.submit()
      }
    )
  }
  payWithPostFinance(pledgeId, pledgeResponse) {
    const { t } = this.props

    this.setState(
      () => ({
        loading: t('pledge/submit/loading/postfinance'),
        pledgeId: pledgeId,
        userId: pledgeResponse.userId,
        pfAliasId: pledgeResponse.pfAliasId,
        pfSHA: pledgeResponse.pfSHA
      }),
      () => {
        this.payment.postFinanceForm.submit()
      }
    )
  }
  payWithPaymentSlip(pledgeId) {
    const { values } = this.state
    this.pay({
      pledgeId,
      method: 'PAYMENTSLIP',
      paperInvoice: values.paperInvoice || false,
      address: this.withoutAddress()
        ? undefined
        : {
            name: values.name,
            line1: values.line1,
            line2: values.line2,
            postalCode: values.postalCode,
            city: values.city,
            country: values.country
          }
    })
  }
  pay(data) {
    const { t, me, customMe, user, packageName } = this.props

    this.setState(() => ({
      loading: t('pledge/submit/loading/pay')
    }))
    this.props
      .pay(data)
      .then(({ data: { payPledge } }) => {
        const baseQuery = {
          package: packageName,
          id: payPledge.pledgeId
        }
        if (customMe && customMe.isListed) {
          baseQuery.statement = customMe.id
        }
        if (!me) {
          if (customMe || packageName === 'PROLONG') {
            gotoMerci({
              ...baseQuery,
              email: user.email
            })
            return
          }
          this.props
            .signIn(user.email, 'pledge')
            .then(({ data: { signIn } }) =>
              gotoMerci({
                ...baseQuery,
                email: user.email,
                ...encodeSignInResponseQuery(signIn)
              })
            )
            .catch(error =>
              gotoMerci({
                ...baseQuery,
                email: user.email,
                signInError: errorToString(error)
              })
            )
        } else {
          gotoMerci(baseQuery)
        }
      })
      .catch(error => {
        this.setState(() => ({
          loading: false,
          paymentError: errorToString(error)
        }))
      })
  }
  payWithStripe(pledgeId) {
    const { t, total } = this.props
    const { values } = this.state

    this.setState(() => ({
      loading: t('pledge/submit/loading/stripe')
    }))

    if (values.paymentSource) {
      this.pay({
        pledgeId,
        method: 'STRIPE',
        sourceId: values.paymentSource
      })
      return
    }

    this.payment
      .createStripeSource({
        total,
        metadata: {
          pledgeId
        },
        on3DSecure: () => {
          this.setState({
            loading: t('pledge/submit/loading/stripe/3dsecure')
          })
        },
        returnUrl: `${PUBLIC_BASE_URL}/angebote?${STRIPE_PLEDGE_ID_QUERY_KEY}=${pledgeId}&stripe=1`
      })
      .then(source => {
        this.setState({
          loading: false,
          paymentError: undefined
        })
        this.pay({
          pledgeId,
          method: 'STRIPE',
          sourceId: source.id,
          pspPayload: source
        })
      })
      .catch(error => {
        this.setState({
          loading: false,
          paymentError: error
        })
      })
  }
  getErrorMessages() {
    const { consents, values } = this.state
    const { t, options } = this.props

    return [options.length < 1 && t('pledge/submit/package/error')]
      .concat(objectValues(this.props.errors))
      .concat(objectValues(this.state.errors))
      .concat([
        !values.paymentMethod && t('pledge/submit/payMethod/error'),
        getConsentsError(t, getRequiredConsents(this.props), consents)
      ])
      .filter(Boolean)
  }
  getAutoPayValue() {
    const { forceAutoPay, options } = this.props
    const {
      values: { paymentMethod },
      autoPay
    } = this.state

    if (paymentMethod !== 'STRIPE') {
      return undefined
    }
    if (forceAutoPay) {
      return true
    }
    if (autoPay === undefined) {
      return options.every(option => option.autoPay !== false)
    }
    return autoPay
  }
  renderAutoPay() {
    const {
      values: { paymentMethod }
    } = this.state
    if (paymentMethod !== 'STRIPE') {
      return null
    }
    const { t, packageName, forceAutoPay, options } = this.props

    if (options.every(option => option.autoPay === undefined)) {
      return null
    }

    const label = t.first([
      `pledge/submit/${packageName}/autoPay`,
      'pledge/submit/autoPay'
    ])
    const note = t.first(
      [
        `pledge/submit/${packageName}/autoPay/note`,
        'pledge/submit/autoPay/note'
      ],
      undefined,
      null
    )

    return (
      <div style={{ marginTop: 10 }}>
        {forceAutoPay ? (
          note && <Label>{note}</Label>
        ) : (
          <Checkbox
            checked={this.getAutoPayValue()}
            onChange={(_, checked) => {
              this.setState({ autoPay: checked })
            }}
          >
            {label}
            {note && <br />}
            {note && <Label>{note}</Label>}
          </Checkbox>
        )}
      </div>
    )
  }
  render() {
    const {
      emailVerify,
      paymentError,
      submitError,
      signInError,
      loading
    } = this.state
    const { me, user, t, query, paymentMethods } = this.props

    const errorMessages = this.getErrorMessages()

    return (
      <div>
        <PaymentForm
          key={me && me.id}
          ref={this.paymentRef}
          t={t}
          loadSources={!!me || !!query.token}
          accessToken={query.token}
          onlyChargable
          withoutAddress={this.withoutAddress()}
          payload={{
            id: this.state.pledgeId,
            userId: this.state.userId,
            total: this.props.total,
            pfAliasId: this.state.pfAliasId,
            pfSHA: this.state.pfSHA
          }}
          allowedMethods={paymentMethods}
          onChange={fields => {
            this.setState(state => {
              const nextState = FieldSet.utils.mergeFields(fields)(state)

              if (
                state.values.paymentMethod !== nextState.values.paymentMethod ||
                state.values.paymentSource !== nextState.values.paymentSource
              ) {
                nextState.showErrors = false
                nextState.errors = {}
              }

              return nextState
            })
          }}
          values={this.state.values}
          errors={this.state.errors}
          dirty={this.state.dirty}
        />
        <br />
        <br />
        {emailVerify && !me && (
          <div style={{ marginBottom: 40 }}>
            <P style={{ marginBottom: 10 }}>
              {t('pledge/submit/emailVerify/note')}
            </P>
            <SignIn context='pledge' email={user.email} />
          </div>
        )}
        {emailVerify && me && (
          <div style={{ marginBottom: 40 }}>
            <P>{t('pledge/submit/emailVerify/done')}</P>
          </div>
        )}
        {!!submitError && (
          <P style={{ color: colors.error, marginBottom: 40 }}>{submitError}</P>
        )}
        {!!paymentError && (
          <P style={{ color: colors.error, marginBottom: 40 }}>
            {paymentError}
          </P>
        )}
        {!!signInError && (
          <P style={{ color: colors.error, marginBottom: 40 }}>{signInError}</P>
        )}
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <InlineSpinner />
            <br />
            {loading}
          </div>
        ) : (
          <div>
            {!!this.state.showErrors && errorMessages.length > 0 && (
              <div style={{ color: colors.error, marginBottom: 40 }}>
                {t('pledge/submit/error/title')}
                <br />
                <ul>
                  {errorMessages.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <Consents
              required={getRequiredConsents(this.props)}
              accepted={this.state.consents}
              onChange={keys => {
                this.setState(() => ({
                  consents: keys
                }))
              }}
            />
            {this.renderAutoPay()}
            <br />
            <br />
            <div style={{ opacity: errorMessages.length ? 0.5 : 1 }}>
              <Button
                block
                primary={!errorMessages.length}
                onClick={() => {
                  this.submitPledge()
                }}
              >
                {t('pledge/submit/button/pay', {
                  formattedChf: this.props.total
                    ? chfFormat(this.props.total / 100)
                    : ''
                })}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

Submit.propTypes = {
  me: PropTypes.object,
  user: PropTypes.object,
  paymentMethods: PropTypes.array,
  total: PropTypes.number,
  reason: PropTypes.string,
  options: PropTypes.array.isRequired,
  submit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onError: PropTypes.func.isRequired
}

const submitPledge = gql`
  mutation submitPledge(
    $total: Int!
    $options: [PackageOptionInput!]!
    $user: UserInput!
    $reason: String
    $messageToClaimers: String
    $consents: [String!]
    $accessToken: ID
  ) {
    submitPledge(
      pledge: {
        total: $total
        options: $options
        user: $user
        reason: $reason
        messageToClaimers: $messageToClaimers
        accessToken: $accessToken
      }
      consents: $consents
    ) {
      pledgeId
      userId
      emailVerify
      pfAliasId
      pfSHA
    }
  }
`

const payPledge = gql`
  mutation payPledge(
    $pledgeId: ID!
    $method: PaymentMethod!
    $sourceId: String
    $pspPayload: JSON
    $address: AddressInput
    $paperInvoice: Boolean
  ) {
    payPledge(
      pledgePayment: {
        pledgeId: $pledgeId
        method: $method
        sourceId: $sourceId
        pspPayload: $pspPayload
        address: $address
        paperInvoice: $paperInvoice
      }
    ) {
      pledgeId
      userId
      emailVerify
    }
  }
`

let pendingOrder
const setPendingOrder = order => {
  pendingOrder = order
}

export const withPay = Component => {
  const EnhancedComponent = compose(
    graphql(payPledge, {
      props: ({ mutate }) => ({
        pay: variables =>
          mutate({
            variables,
            refetchQueries: [{ query: addressQuery }]
          }).then(response => {
            return new Promise((resolve, reject) => {
              if (!pendingOrder) {
                resolve(response)
              } else {
                pendingOrder.options.forEach(option => {
                  track([
                    'addEcommerceItem',
                    option.templateId, // (required) SKU: Product unique identifier
                    undefined, // (optional) Product name
                    undefined, // (optional) Product category
                    option.price / 100, // (recommended) Product price
                    option.amount // (optional, default to 1) Product quantity
                  ])
                })
                track([
                  'trackEcommerceOrder',
                  response.data.payPledge.pledgeId, // (required) Unique Order ID
                  pendingOrder.total / 100, // (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
                  undefined, // (optional) Order sub total (excludes shipping)
                  undefined, // (optional) Tax amount
                  undefined, // (optional) Shipping amount
                  !!pendingOrder.reason // (optional) Discount offered (set to false for unspecified parameter)
                ])
                // give piwik a second to track
                setTimeout(() => {
                  resolve(response)
                }, 1000)
              }
            })
          })
      })
    }),
    withSignIn
  )(Component)
  return props => <EnhancedComponent {...props} />
}

const SubmitWithMutations = compose(
  graphql(submitPledge, {
    props: ({ mutate }) => ({
      submit: variables => {
        setPendingOrder(variables)

        return mutate({
          variables
        })
      }
    })
  }),
  withSignOut,
  withPay,
  withMe,
  withT
)(Submit)

export default SubmitWithMutations
