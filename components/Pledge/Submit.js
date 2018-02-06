import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import SignIn, { withSignIn } from '../Auth/SignIn'
import { withSignOut } from '../Auth/SignOut'

import { errorToString } from '../../lib/utils/errors'
import withT from '../../lib/withT'
import { meQuery } from '../../lib/apollo/withMe'
import { chfFormat } from '../../lib/utils/format'
import track from '../../lib/piwik'

import { gotoMerci } from './Merci'

import { COUNTRIES } from '../Account/AddressForm'
import { query as addressQuery } from '../Account/UpdateMe'

import FieldSet from '../FieldSet'

import {
  PUBLIC_BASE_URL
} from '../../lib/constants'

import {
  Interaction, Button, Checkbox,
  colors, InlineSpinner,
  RawHtml
} from '@project-r/styleguide'

import PaymentForm from '../Payment/Form'

const {P} = Interaction

const objectValues = (object) => Object.keys(object).map(key => object[key])
const simpleHash = (object, delimiter = '|') => {
  return objectValues(object).map(value => {
    if (value && typeof value === 'object') {
      return simpleHash(value, delimiter === '|' ? '$' : `$${delimiter}`)
    }
    return `${value}`
  }).join(delimiter)
}

class Submit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      emailVerify: false,
      legal: false,
      values: {
        country: COUNTRIES[0],
        name: [
          props.user.firstName,
          props.user.lastName
        ].filter(Boolean).join(' ')
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
    this.paymentRef = (ref) => {
      this.payment = ref && ref.getWrappedInstance
        ? ref.getWrappedInstance()
        : ref
    }
  }
  componentWillReceiveProps (nextProps) {
    const nextName = [
      nextProps.user.firstName,
      nextProps.user.lastName
    ].filter(Boolean).join(' ')
    if (
      nextName !== this.state.values.name &&
      !this.state.dirty.name
    ) {
      this.setState((state) => ({
        values: {
          ...state.values,
          name: nextName
        }
      }))
    }
  }
  submitVariables (props) {
    const {user, total, options, reason} = props

    return {
      total,
      options,
      reason,
      user
    }
  }
  submitPledge () {
    const {t, me} = this.props
    const errorMessages = this.getErrorMessages()

    if (errorMessages.length) {
      this.props.onError()
      this.setState((state) => {
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
    if (me && me.email !== variables.user.email) {
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
      (
        this.state.values.paymentMethod !== 'POSTFINANCECARD' ||
        this.state.pledgeResponse
      )
    ) {
      this.payPledge(this.state.pledgeId, this.state.pledgeResponse)
      return
    }

    this.setState(() => ({
      loading: t('pledge/submit/loading/submit')
    }))
    this.props.submit(variables)
      .then(({data}) => {
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
        this.payPledge(
          data.submitPledge.pledgeId,
          data.submitPledge
        )
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
  payPledge (pledgeId, pledgeResponse) {
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
  payWithPayPal (pledgeId) {
    const {t} = this.props

    this.setState(() => ({
      loading: t('pledge/submit/loading/paypal'),
      pledgeId: pledgeId
    }), () => {
      this.payment.payPalForm.submit()
    })
  }
  payWithPostFinance (pledgeId, pledgeResponse) {
    const {t} = this.props

    this.setState(() => ({
      loading: t('pledge/submit/loading/postfinance'),
      pledgeId: pledgeId,
      userId: pledgeResponse.userId,
      pfAliasId: pledgeResponse.pfAliasId,
      pfSHA: pledgeResponse.pfSHA
    }), () => {
      this.payment.postFinanceForm.submit()
    })
  }
  payWithPaymentSlip (pledgeId) {
    const {values} = this.state
    this.pay({
      pledgeId,
      method: 'PAYMENTSLIP',
      paperInvoice: values.paperInvoice || false,
      address: {
        name: values.name,
        line1: values.line1,
        line2: values.line2,
        postalCode: values.postalCode,
        city: values.city,
        country: values.country
      }
    })
  }
  pay (data) {
    const {t, me, user, isNewMember} = this.props

    this.setState(() => ({
      loading: t('pledge/submit/loading/pay')
    }))
    this.props.pay(data)
      .then(({data: {payPledge}}) => {
        if (!me) {
          this.props.signIn(user.email, 'pledge')
            .then(({data: {signIn}}) => gotoMerci({
              id: payPledge.pledgeId,
              email: user.email,
              phrase: signIn.phrase
            }))
            .catch(error => gotoMerci({
              id: data.pledgeId,
              email: user.email,
              signInError: errorToString(error)
            }))
        } else {
          gotoMerci({
            id: payPledge.pledgeId
          })
        }
      })
      .catch(error => {
        this.setState(() => ({
          loading: false,
          paymentError: errorToString(error)
        }))
      })
  }
  payWithStripe (pledgeId) {
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

    this.payment.createStripeSource({
      total,
      metadata: {
        pledgeId
      },
      on3DSecure: () => {
        this.setState({
          loading: t('pledge/submit/loading/stripe/3dsecure')
        })
      },
      returnUrl: `${PUBLIC_BASE_URL}/angebote?pledgeId=${pledgeId}&stripe=1`
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
  getErrorMessages () {
    const {
      legal,
      values
    } = this.state
    const {
      t, options,
      requiresStatutes
    } = this.props

    return ([
      options.length < 1 && t('pledge/submit/package/error')
    ])
      .concat(objectValues(this.props.errors))
      .concat(objectValues(this.state.errors))
      .concat([
        !values.paymentMethod && t('pledge/submit/payMethod/error'),
        !legal && t(requiresStatutes
          ? 'pledge/submit/legal/error/statute'
          : 'pledge/submit/legal/error/plain')
      ])
      .filter(Boolean)
  }
  render () {
    const {
      emailVerify,
      paymentError,
      submitError,
      signInError,
      loading
    } = this.state
    const {
      me, user, t,
      paymentMethods,
      requiresStatutes
    } = this.props

    const errorMessages = this.getErrorMessages()

    return (
      <div>
        <PaymentForm
          ref={this.paymentRef}
          t={t}
          loadSources={!!me}
          onlyChargable
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
          dirty={this.state.dirty} />
        <br /><br />
        {(emailVerify && !me) && (
          <div style={{marginBottom: 40}}>
            <P style={{marginBottom: 10}}>
              {t('pledge/submit/emailVerify/note')}
            </P>
            <SignIn email={user.email} />
          </div>
        )}
        {(emailVerify && me) && (
          <div style={{marginBottom: 40}}>
            <P>{t('pledge/submit/emailVerify/done')}</P>
          </div>
        )}
        {!!submitError && (
          <P style={{color: colors.error, marginBottom: 40}}>
            {submitError}
          </P>
        )}
        {!!paymentError && (
          <P style={{color: colors.error, marginBottom: 40}}>
            {paymentError}
          </P>
        )}
        {!!signInError && (
          <P style={{color: colors.error, marginBottom: 40}}>
            {signInError}
          </P>
        )}
        {loading ? (
          <div style={{textAlign: 'center'}}>
            <InlineSpinner />
            <br />
            {loading}
          </div>
        ) : (
          <div>
            {!!this.state.showErrors && errorMessages.length > 0 && (
              <div style={{color: colors.error, marginBottom: 40}}>
                {t('pledge/submit/error/title')}<br />
                <ul>
                  {errorMessages.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <Checkbox
              checked={this.state.legal}
              onChange={(_, checked) => {
                this.setState(() => ({legal: checked}))
              }}>
              <RawHtml dangerouslySetInnerHTML={{
                __html: t(requiresStatutes
                  ? 'pledge/submit/legal/label/statute'
                  : 'pledge/submit/legal/label/plain'
                )
              }} />
            </Checkbox>
            <br /><br />
            <div style={{opacity: errorMessages.length ? 0.5 : 1}}>
              <Button
                block
                onClick={() => {
                  this.submitPledge()
                }}>
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
  mutation submitPledge($total: Int!, $options: [PackageOptionInput!]!, $user: UserInput!, $reason: String) {
    submitPledge(pledge: {total: $total, options: $options, user: $user, reason: $reason}) {
      pledgeId
      userId
      emailVerify
      pfAliasId
      pfSHA
    }
  }
`

const payPledge = gql`
  mutation payPledge($pledgeId: ID!, $method: PaymentMethod!, $sourceId: String, $pspPayload: JSON, $address: AddressInput, $paperInvoice: Boolean) {
    payPledge(pledgePayment: {pledgeId: $pledgeId, method: $method, sourceId: $sourceId, pspPayload: $pspPayload, address: $address, paperInvoice: $paperInvoice}) {
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
      props: ({mutate}) => ({
        pay: variables => mutate({
          variables,
          refetchQueries: [
            {query: addressQuery}
          ]
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
    props: ({mutate}) => ({
      submit: variables => {
        setPendingOrder(variables)

        return mutate({
          variables,
          refetchQueries: [{
            query: meQuery
          }]
        })
      }
    })
  }),
  withSignOut,
  withPay,
  withT
)(Submit)

export default SubmitWithMutations
