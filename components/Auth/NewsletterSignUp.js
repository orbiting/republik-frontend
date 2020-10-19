import React, { useState } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import NewsletterSubscriptions from '../Account/NewsletterSubscriptions'
import EmailForm, { checkEmail } from './EmailForm'

import { Interaction } from '@project-r/styleguide'

const SignUp = ({
  me,
  name,
  free,
  black,
  skipBox,
  t,
  requestSubscription,
  context = 'newsletter'
}) => {
  const [state, setState] = useState(() => checkEmail({ value: '', t }))
  const [serverState, setServerState] = useState({})
  if (me || !free) {
    return (
      <>
        <Interaction.P>
          <strong>{t('Auth/NewsletterSignUp/settingTitle')}</strong>
        </Interaction.P>
        <NewsletterSubscriptions
          black={black}
          skipBox={skipBox}
          label={t('Auth/NewsletterSignUp/settingLabel')}
          filter={subscription => subscription.name === name}
        />
      </>
    )
  }
  if (serverState.success) {
    return <Interaction.P>{t('Auth/NewsletterSignUp/success')}</Interaction.P>
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
    $context: String!
  ) {
    requestNewsletterSubscription(email: $email, name: $name, context: $context)
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
