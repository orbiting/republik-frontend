import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withT from '../../lib/withT'
import withMe from '../../lib/apollo/withMe'

import { Router } from '../../lib/routes'

import { errorToString } from '../../lib/utils/errors'

import FieldSet from '../FieldSet'
import PaymentForm, { query } from '../Payment/Form'
import loadStripe from '../Payment/stripe'
import { P } from './Elements'

import { Button, InlineSpinner, colors } from '@project-r/styleguide'

import { PUBLIC_BASE_URL } from '../../lib/constants'

const objectValues = object => Object.keys(object).map(key => object[key])

class PaymentSources extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      values: {},
      dirty: {},
      errors: {}
    }
    this.paymentRef = ref => {
      this.payment =
        ref && ref.getWrappedInstance ? ref.getWrappedInstance() : ref
    }
  }
  addSource(source) {
    this.props
      .addSource(source)
      .then(() => {
        this.setState({
          loading: false,
          remoteError: undefined,
          values: {
            paymentSource: source.id,
            paymentMethod: 'STRIPE'
          },
          errors: {},
          dirty: {}
        })
      })
      .catch(error => {
        this.setState({
          loading: false,
          remoteError: errorToString(error)
        })
      })
  }
  createStripeSource() {
    const { me, t, total } = this.props
    this.setState({
      loading: t('account/paymentSource/saving'),
      remoteError: undefined
    })
    this.payment
      .createStripeSource({
        total,
        metadata: {
          userId: me.id
        },
        on3DSecure: () => {
          this.setState({
            loading: t('account/paymentSource/3dsecure')
          })
        },
        returnUrl: `${PUBLIC_BASE_URL}/account?stripe=1`
      })
      .then(source => {
        this.addSource(source)
      })
      .catch(error => {
        this.setState({
          loading: false,
          remoteError: error
        })
      })
  }
  checkStripeSource({ query }) {
    const { t } = this.props

    loadStripe()
      .then(stripe => {
        stripe.source.get(
          query.source,
          query.client_secret,
          (status, source) => {
            if (source.status === 'chargeable') {
              this.addSource(source)
            } else {
              this.setState(() => ({
                loading: false,
                remoteError: t('account/paymentSource/3dsecure/failed')
              }))
            }
          }
        )
      })
      .catch(() => {
        this.setState(() => ({
          loading: false,
          remoteError: t('payment/stripe/js/failed')
        }))
      })
  }
  componentDidMount() {
    const { query } = this.props
    if (query.stripe) {
      this.checkStripeSource({ query })
      Router.replaceRoute('account', {}, { shallow: true })
    }
  }
  render() {
    const { t, me } = this.props
    const { values, errors, dirty, loading, remoteError } = this.state

    const errorMessages = objectValues(errors).filter(Boolean)

    return (
      <Fragment>
        <PaymentForm
          ref={this.paymentRef}
          t={t}
          loadSources
          payload={{
            id: me.id
          }}
          context='DEFAULT_SOURCE'
          allowedMethods={['STRIPE']}
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
          values={values}
          errors={errors}
          dirty={dirty}
        />
        {!!remoteError && (
          <P style={{ color: colors.error, marginBottom: 40 }}>{remoteError}</P>
        )}
        {loading && (
          <div>
            <InlineSpinner />
            <br />
            {loading}
          </div>
        )}
        {!loading && values.newSource && (
          <Fragment>
            {!!this.state.showErrors && errorMessages.length > 0 && (
              <div style={{ color: colors.error, marginBottom: 40 }}>
                {t('account/paymentSource/error')}
                <br />
                <ul>
                  {errorMessages.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              style={{ opacity: errorMessages.length ? 0.5 : 1 }}
              onClick={() => {
                if (errorMessages.length) {
                  this.setState(state => {
                    const dirty = {}
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
                this.createStripeSource()
              }}
            >
              {t('account/paymentSource/save')}
            </Button>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

const addSource = gql`
  mutation addPaymentSource($sourceId: String!, $pspPayload: JSON!) {
    addPaymentSource(sourceId: $sourceId, pspPayload: $pspPayload) {
      id
      last4
      brand
      isDefault
      status
      expMonth
      expYear
    }
  }
`

export default compose(
  withT,
  withMe,
  graphql(addSource, {
    props: ({ mutate }) => ({
      addSource: source => {
        return mutate({
          variables: {
            sourceId: source.id,
            pspPayload: source
          },
          refetchQueries: [
            {
              query
            }
          ]
        })
      }
    })
  })
)(PaymentSources)
