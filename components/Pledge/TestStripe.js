import React, { useState } from 'react'
import {
  Field,
  colors,
  Interaction,
  Button,
  fontStyles,
  Editorial,
  A,
  Label,
  mediaQueries
} from '@project-r/styleguide'
import withT from '../../lib/withT'
import isEmail from 'validator/lib/isEmail'
import Consents, { getConsentsError } from './Consents'
import {
  Elements,
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_PUBLISHABLE_KEY } from '../../lib/constants'
import { css } from 'glamor'

import SignIn, { withSignIn } from '../Auth/SignIn'
import { withSignOut } from '../Auth/SignOut'
import withMe from '../../lib/apollo/withMe'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

const OFFERS = [
  {
    package: 'MONTHLY_ABO',
    label: 'Monatlich',
    price: 'CHF 22 pro Monat',
    text:
      'Schön, dass Sie dabei sind. Sie erhalten täglich eine bis drei neue Geschichten.',
    submitPledgeProps: {
      total: 2000,
      options: [
        {
          amount: 1,
          periods: 1,
          price: 2000,
          templateId: '00000000-0000-0000-0008-000000000002',
          autoPay: true
        }
      ]
    }
  },
  {
    package: 'ABO',
    label: 'Jährlich',
    price: 'CHF 240 pro Jahr',
    text:
      'Sie erhalten täglich eine bis drei neue Geschichten und werden Mitglied der Project R Genossenschaft. Und sicheren so die Zukunft der Republik.',
    submitPledgeProps: {
      total: 24000,
      options: [
        {
          amount: 1,
          periods: 1,
          price: 24000,
          templateId: '00000000-0000-0000-0008-000000000001',
          autoPay: true
        }
      ]
    }
  }
]

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
const styles = {
  label: css({
    color: '#B7C1BD',
    fontSize: 12,
    lineHeight: '13px',
    ...fontStyles.sansSerifRegular,
    marginBottom: 13,
    [mediaQueries.mUp]: {
      marginBottom: 9,
      fontSize: 14,
      lineHeight: '15px'
    }
  })
}

const Join = ({ t, black, start, submit, pay, me }) => {
  return (
    <Elements
      stripe={stripePromise}
      fonts={[
        {
          family: fontStyles.sansSerifRegular.fontFamily,
          weight: fontStyles.sansSerifRegular.fontWeight,
          src:
            'https://cdn.repub.ch/s3/republik-assets/fonts/gt-america-standard-regular.woff)'
        }
      ]}
    >
      <Form
        t={t}
        black={black}
        start={start}
        submit={submit}
        pay={pay}
        me={me}
      />
    </Elements>
  )
}

const Form = ({ t, black, start, submit, pay, me }) => {
  const [currentOffer, setOffer] = useState(OFFERS[1])
  const [emailState, setEmailState] = useState({ value: me?.email || '' })
  const [consents, setConsents] = useState([])
  const stripe = useStripe()
  const elements = useElements()

  return (
    <form style={{ display: 'block', minHeight: 1000 }}>
      <Interaction.H1 id='join' style={{ marginBottom: 15 }}>
        Abonnentin und Mitglied werden
      </Interaction.H1>
      <Interaction.P
        style={{ fontSize: 17, lineHeight: '26px', marginBottom: 20 }}
      >
        Unabhängiger Journalismus kostet. Die Republik ist werbefrei und wird
        finanziert von ihren Leserinnen.{' '}
        {!start && (
          <Editorial.A href='/'>Mehr Informationen zur Republik.</Editorial.A>
        )}
      </Interaction.P>
      {OFFERS.map(offer => {
        const isSelected = offer.package === currentOffer.package
        return (
          <div
            key={offer.package}
            style={{
              borderBottom: isSelected
                ? `2px solid ${black ? '#000' : colors.primary}`
                : '2px solid transparent',
              marginRight: 15,
              marginBottom: 10,
              paddingBottom: 5,
              float: 'left',
              fontSize: 22,
              ...(isSelected && fontStyles.sansSerifMedium),
              cursor: isSelected ? 'default' : 'pointer'
            }}
            onClick={e => {
              e.preventDefault()
              setOffer(offer)
            }}
          >
            {offer.label}
          </div>
        )
      })}
      <br style={{ clear: 'both' }} />
      <Interaction.P style={{ fontSize: 17, lineHeight: '26px' }}>
        {currentOffer.text}
      </Interaction.P>
      <Field
        black={black}
        name='email'
        type='email'
        label={t('pledge/contact/email/label')}
        error={emailState.dirty && emailState.error}
        onChange={(_, value, shouldValidate) => {
          setEmailState(state => ({
            ...state,
            value,
            dirty: shouldValidate,
            error:
              (value.trim().length <= 0 &&
                t('pledge/contact/email/error/empty')) ||
              (!isEmail(value) && t('pledge/contact/email/error/invalid'))
          }))
        }}
        value={emailState.value}
      />
      <div
        style={{
          borderBottom: `1px solid ${black ? 'black' : colors.disabled}`,
          paddingTop: 5,
          paddingBottom: 5,
          marginBottom: 20
        }}
      >
        <div {...styles.label}>Ihre Kreditkarte</div>
        <CardElement
          options={{
            hidePostalCode: true,
            // iconStyle: 'solid',
            style: {
              base: {
                fontSize: '22px',
                ...fontStyles.sansSerifRegular,
                color: colors.text,
                // borderBottom: '1px solid black',
                '::placeholder': {
                  color: colors.disabled
                },
                ':disabled': {
                  color: colors.disabled
                }
              },
              invalid: {
                color: colors.error
              }
            }
          }}
        />
      </div>
      <Button
        block
        primary
        black={black}
        style={black ? { backgroundColor: 'black', color: 'white' } : undefined}
        onClick={async e => {
          e.preventDefault()
          console.log('submiting...')

          if (!emailState.value?.length) {
            alert('email missing')
            return
          }

          submit({
            ...currentOffer.submitPledgeProps,
            user: {
              firstName: 'Patrick',
              lastName: 'Tester',
              email: emailState.value
            },
            consents: ['PRIVACY', 'TOS', 'STATUTE'],
            payload: {}
          })
            .then(async ({ data }) => {
              console.log('submitPledge', { data })

              const { stripeClientSecret } = data.submitPledge

              const card = elements.getElement(CardElement)
              const { paymentIntent, error } = await stripe.confirmCardPayment(
                stripeClientSecret,
                {
                  payment_method: { card }
                }
              )
              console.log({ paymentIntent, error })
              if (error) {
                console.warn(error)
                alert('there was a problem with confirmCardPayment')
                return
              }

              pay({
                pledgeId: data.submitPledge.pledgeId,
                method: 'STRIPE',
                paymentMethodId: paymentIntent.payment_method,
                pspPayload: paymentIntent
              })
                .then(result => {
                  console.log('payPledge', result)
                })
                .catch(error => {
                  console.warn(error)
                })
            })
            .catch(error => {
              console.warn(error)
            })
        }}
      >
        {currentOffer.price}
      </Button>
    </form>
  )
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
    $payload: JSON
  ) {
    submitPledge(
      pledge: {
        total: $total
        options: $options
        user: $user
        reason: $reason
        messageToClaimers: $messageToClaimers
        accessToken: $accessToken
        payload: $payload
      }
      consents: $consents
    ) {
      pledgeId
      userId
      emailVerify
      pfAliasId
      pfSHA
      stripeClientSecret
    }
  }
`

const payPledge = gql`
  mutation payPledge(
    $pledgeId: ID!
    $method: PaymentMethod!
    $sourceId: String
    $paymentMethodId: String
    $pspPayload: JSON
    $address: AddressInput
    $paperInvoice: Boolean
    $makeDefault: Boolean
  ) {
    payPledge(
      pledgePayment: {
        pledgeId: $pledgeId
        method: $method
        sourceId: $sourceId
        paymentMethodId: $paymentMethodId
        makeDefault: $makeDefault
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

export const withPay = Component => {
  const EnhancedComponent = compose(
    graphql(payPledge, {
      props: ({ mutate }) => ({
        pay: variables =>
          mutate({
            variables
          }).then(response => {
            console.log('payPledge response:', response)
          })
      })
    }),
    withSignIn
  )(Component)
  return props => <EnhancedComponent {...props} />
}

const JoinWithMutations = compose(
  graphql(submitPledge, {
    props: ({ mutate }) => ({
      submit: variables => {
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
)(Join)

export default JoinWithMutations
