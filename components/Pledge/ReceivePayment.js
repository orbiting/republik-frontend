import React, {Component} from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'
import Loader from '../Loader'
import { errorToString } from '../../lib/utils/errors'

import { withPay } from './Submit'
import PledgeForm from './Form'
import { gotoMerci } from './Merci'
import loadStripe from './stripe'

import { EMAIL_PAYMENT } from '../../lib/constants'

const pledgeQuery = gql`
query($pledgeId: ID!) {
  pledge(id: $pledgeId) {
    id
    package {
      name
    }
    options {
      templateId
      amount
    }
    total
    donation
    reason
    user {
      firstName
      lastName
      email
    }
  }
}
`

class PledgeReceivePayment extends Component {
  constructor (props, context) {
    super(props, context)

    const {query, t} = props

    const state = this.state = {}
    if (query.orderID) {
      if (query.STATUS === '9' || query.STATUS === '91') {
        state.processing = true
        state.action = {
          method: 'pay',
          argument: {
            method: 'POSTFINANCECARD',
            pspPayload: JSON.stringify(query)
          }
        }
      } else {
        // https://e-payment-postfinance.v-psp.com/de/guides/user%20guides/statuses-and-errors
        // https://e-payment-postfinance.v-psp.com/de/guides/integration%20guides/possible-errors

        const errorVariables = {
          mailto: `mailto:${EMAIL_PAYMENT}?subject=${
            encodeURIComponent(
              t(
                'pledge/recievePayment/pf/mailto/subject',
                {status: query.STATUS}
              )
            )}&body=${
            encodeURIComponent(
              t(
                'pledge/recievePayment/pf/mailto/body',
                {
                  pledgeId: query.orderID,
                  payload: JSON.stringify(query, null, 2)
                }
              )
            )}`
        }

        switch (query.STATUS) {
          case '92':
            state.receiveError = t(
              'pledge/recievePayment/pf/92',
              errorVariables
            )
            break
          case '93':
            state.receiveError = t(
              'pledge/recievePayment/pf/retry',
              errorVariables
            )
            break
          case '0':
            state.receiveError = t(
              'pledge/recievePayment/pf/invalid',
              errorVariables
            )
            break
          case '1':
            state.receiveError = t(
              'pledge/recievePayment/pf/canceled',
              errorVariables
            )
            break
          case '2':
            state.receiveError = t(
              'pledge/recievePayment/pf/denied',
              errorVariables
            )
            break
          default:
            state.receiveError = t(
              'pledge/recievePayment/error',
              errorVariables
            )
        }
      }
    }
    if (query.item_name) {
      if (query.st === 'Completed') {
        state.processing = true
        state.action = {
          method: 'pay',
          argument: {
            method: 'PAYPAL',
            pspPayload: JSON.stringify(query)
          }
        }
      } else {
        // https://developer.paypal.com/docs/classic/ipn/integration-guide/IPNandPDTVariables/#id091EB04C0HS
        // - payment_status
        switch (query.st) {
          case 'Cancel':
            // see cancel_return in ./paypal.js
            state.receiveError = t('pledge/recievePayment/paypal/cancel')
            break
          case 'Denied':
          case 'Expired':
          case 'Failed':
          case 'Voided':
            state.receiveError = t('pledge/recievePayment/paypal/deny')
            break
          case 'Canceled_Reversal':
          case 'Refunded':
          case 'Reversed':
          case 'Processed':
          case 'Pending':
            const errorVariables = {
              mailto: `mailto:${EMAIL_PAYMENT}?subject=${
                encodeURIComponent(
                  t(
                    'pledge/recievePayment/paypal/mailto/subject',
                    {status: query.st}
                  )
                )}&body=${
                encodeURIComponent(
                  t(
                    'pledge/recievePayment/paypal/mailto/body',
                    {
                      pledgeId: query.item_name,
                      payload: JSON.stringify(query, null, 2)
                    }
                  )
                )}`
            }
            state.receiveError = t('pledge/recievePayment/paypal/contactUs', errorVariables)
            break
          default:
            state.receiveError = t('pledge/recievePayment/error')
        }
      }
    }
    if (query.pledgeId && query.stripe) {
      state.processing = true
      state.action = {
        method: 'checkStripeSource',
        argument: {
          query: {
            ...query
          }
        }
      }
    }

    this.queryFromPledge = () => {
      const {pledge} = this.props

      const query = {
        package: pledge.package.name
      }
      if (pledge.donation < 0) {
        query.userPrice = '1'
      }
      return query
    }
  }
  checkStripeSource ({query}) {
    const {t} = this.props

    loadStripe()
      .then(stripe => {
        stripe.source.get(
          query.source,
          query.client_secret,
          (status, source) => {
            if (source.status === 'chargeable') {
              this.pay({
                method: 'STRIPE',
                pspPayload: JSON.stringify(source),
                sourceId: source.id
              })
            } else {
              this.setState(() => ({
                processing: false,
                receiveError: t('pledge/recievePayment/3dsecure/failed')
              }))
            }
          }
        )
      })
      .catch(() => {
        this.setState(() => ({
          processing: false,
          receiveError: t('pledge/submit/stripe/js/failed')
        }))
      })
  }
  pay ({method, pspPayload, sourceId}) {
    const {me, pledge, pledgeId} = this.props

    this.props.pay({
      pledgeId,
      method,
      pspPayload,
      sourceId
    })
      .then(({data: {payPledge}}) => {
        if (!me) {
          this.props.signIn(pledge.user.email, 'pledge')
            .then(({data: {signIn}}) => gotoMerci({
              id: payPledge.pledgeId,
              email: pledge.user.email,
              phrase: signIn.phrase
            }))
            .catch(error => gotoMerci({
              id: payPledge.pledgeId,
              email: pledge.user.email,
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
          processing: false,
          receiveError: errorToString(error)
        }))
      })
  }
  componentDidMount () {
    // const {pledge} = this.props
    // if (!pledge) {
    //   return
    // }
    // const url = {
    //   pathname: '/pledge',
    //   query: this.queryFromPledge()
    // }
    // Router.replace(url, url, {shallow: true})

    const {action} = this.state
    if (action) {
      this[action.method](action.argument)
    }
  }
  render () {
    const {loading, error, pledge, crowdfundingName, query, t} = this.props
    const {processing, receiveError} = this.state

    if (processing) {
      return <Loader loading message={t('pledge/submit/loading/pay')} />
    }

    return (
      <Loader loading={loading} error={error} render={() => {
        const queryWithData = {
          ...query,
          ...this.queryFromPledge()
        }

        return (
          <PledgeForm
            crowdfundingName={crowdfundingName}
            receiveError={receiveError}
            query={queryWithData}
            pledge={pledge} />
        )
      }} />
    )
  }
}

const PledgeReceivePaymentById = compose(
  withT,
  graphql(pledgeQuery, {
    props: ({ data, ownProps }) => {
      let error = data.error
      if (data.pledge === null) {
        error = ownProps.t('pledge/recievePayment/noPledge')
      }
      return {
        loading: data.loading,
        error,
        pledge: data.pledge
      }
    }
  }),
  withPay,
  withMe
)(PledgeReceivePayment)

export default PledgeReceivePaymentById
