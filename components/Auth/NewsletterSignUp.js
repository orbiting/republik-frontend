import React, { useState } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import NewsletterSubscriptions from '../Account/NewsletterSubscriptions'
import EmailForm, { checkEmail } from './EmailForm'

const FREE_NEWSLETTER = ['PROJECTR', 'COVID19']

const SignUp = ({
  me,
  name,
  black,
  skipBox,
  t,
  requestSubscription,
  context = 'newsletter'
}) => {
  const [state, setState] = useState(() => checkEmail({ value: '', t }))
  const [serverState, setServerState] = useState({})
  if (me || FREE_NEWSLETTER.indexOf(name) === -1) {
    return (
      <NewsletterSubscriptions
        black={black}
        skipBox={skipBox}
        label={t('Auth/NewsletterSignUp/submit')}
        filter={subscription => subscription.name === name}
      />
    )
  }
  return (
    <EmailForm
      {...state}
      black={black}
      label={t('Auth/NewsletterSignUp/submit')}
      onChange={setState}
      onSubmit={e => {
        e.preventDefault()
        if (state.error) {
          setState({ ...state, dirty: true })
          return
        }

        if (state.loading) {
          return
        }
        setServerState({ loading: true })

        requestSubscription({
          variables: {
            name,
            email: state.email,
            context
          }
        })
          .then(({ data }) => {
            setServerState({ loading: false, success: true })
          })
          .catch(error => {
            setServerState({ loading: false, error })
          })
      }}
      loading={serverState.loading}
      serverError={serverState.error}
    />
  )
}

const signUpMutation = gql`
  mutation requestNewsletter(
    $email: String!
    $name: NewsletterName!
    $context: String
  ) {
    requestNewsletterSubscription(
      email: $email
      name: $name
      context: $context
    ) {
      id
      name
      subscribed
      isEligible
    }
  }
`

export default compose(
  withT,
  withMe,
  graphql(signUpMutation, {
    props: ({ mutate }) => ({
      requestSubscription: mutate
    })
  })
)(SignUp)
