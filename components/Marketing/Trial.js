import React, { useState, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import { format } from 'url'
import isEmail from 'validator/lib/isEmail'

import { withSignIn } from '../Auth/SignIn'
import Consents, { getConsentsError } from '../Pledge/Consents'
import ErrorMessage from '../ErrorMessage'
import SwitchBoard from '../Auth/SwitchBoard'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'
import { TRIAL_CAMPAIGN } from '../../lib/constants'

import { Button, Field, InlineSpinner, Interaction, colors } from '@project-r/styleguide'

const { H1, P } = Interaction

const styles = {
  errorMessages: css({
    color: colors.error,
    marginTop: 40
  }),
  switchBoard: css({
    marginTop: 40
  }),
  button: css({
    marginTop: 40,
    width: 180,
    textAlign: 'center'
  })
}

const REQUIRED_CONSENTS = ['PRIVACY', 'TOS']

const REQUEST_ACCESS = gql`
  mutation requestAccess($campaignId: ID!) {
    requestAccess(campaignId: $campaignId) {
      id
      endAt
    }
  }
`

const toOnboarding = () => {
  window.location = format({ pathname: '/einrichten', query: { context: 'trial' } })
}

const Trial = (props) => {
  const { me, t } = props

  const [consents, setConsents] = useState()
  const [email, setEmail] = useState({ value: '' })
  const [serverError, setServerError] = useState()
  const [phrase, setPhrase] = useState()
  const [signingIn, setSigningIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tokenType, setTokenType] = useState('EMAIL_CODE')
  const [showErrors, setShowErrors] = useState(false)

  const handleEmail = (value, shouldValidate) => {
    setEmail({
      ...email,
      value,
      error: (
        (value.trim().length <= 0 && t('Marketing/Trial/email/error/empty')) ||
        (!isEmail(value) && t('Marketing/Trial/email/error/invalid'))
      ),
      dirty: shouldValidate
    })
  }

  const requestAccess = e => {
    e.preventDefault && e.preventDefault()

    setLoading(true)
    setServerError()

    if (!me) {
      handleEmail(email.value, true)

      if (errorMessages.length > 0) {
        setLoading(false)
        return setShowErrors(true)
      }

      return props.signIn(
        email.value,
        'trial',
        consents,
        tokenType
      )
        .then(({ data: { signIn } }) => {
          setTokenType(signIn.tokenType)
          setPhrase(signIn.phrase)

          setLoading(false)
          setSigningIn(true)
        })
        .catch(error => {
          setServerError(error)
          setLoading(false)
        })
    }

    setSigningIn(false)

    props.requestAccess()
      .then(() => toOnboarding())
      .catch(error => {
        setServerError(error)
        setLoading(false)
      })
  }

  const reset = () => {
    setLoading(false)
    setSigningIn(false)
  }

  const errorMessages = [email.error]
    .concat(getConsentsError(t, REQUIRED_CONSENTS, consents))
    .filter(Boolean)

  return (
    <Fragment>
      <H1>Danke für Ihre Neugier!</H1>
      <P style={{ marginTop: 40 }}>
        Bitte tragen Sie unten Ihre E-Mail-Adresse ein. Im Gegenzug laden wir Sie auf einen Streifzug
        durch die Republik ein. Gerne schicken wir Ihnen zudem einen aktuellen Newsletter, dann sehen
        Sie einen Tag lang, worüber wir berichten.
      </P>

      <form onSubmit={requestAccess}>
        {!me && (
          <div style={{ opacity: (signingIn) ? 0.6 : 1, marginTop: 20 }}>
            <Field
              label={t('Marketing/Trial/email/label')}
              value={email.value}
              error={email.dirty && email.error}
              dirty={email.dirty}
              disabled={signingIn}
              onChange={(_, value, shouldValidate) => handleEmail(value, shouldValidate)} />
            <div style={{ marginTop: 40 }}>
              <Consents
                required={REQUIRED_CONSENTS}
                accepted={consents}
                disabled={signingIn}
                onChange={setConsents} />
            </div>
          </div>
        )}

        {showErrors && errorMessages.length > 0 && (
          <div {...styles.errorMessages}>
            {t('Marketing/Trial/error/title')}<br />
            <ul>
              {errorMessages.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {!signingIn && (
          <div {...styles.button}>
            {loading
              ? <InlineSpinner />
              : <Button
                primary
                type='submit'
                block
                onClick={requestAccess}
                disabled={showErrors && errorMessages.length > 0}>{t('Marketing/Trial/button/label')}</Button>
            }
          </div>
        )}
      </form>

      {signingIn && (
        <div {...styles.switchBoard}>
          <SwitchBoard
            email={email.value}
            tokenType={tokenType}
            phrase={phrase}
            alternativeFirstFactors={[]}
            onCancel={reset}
            onTokenTypeChange={reset}
            onSuccess={requestAccess} />
        </div>
      )}

      {serverError && <ErrorMessage error={serverError} />}

    </Fragment>
  )
}

const requestAccess = graphql(
  REQUEST_ACCESS,
  {
    props: ({ mutate }) => ({
      requestAccess: () => mutate({
        variables: { campaignId: TRIAL_CAMPAIGN }
      })
    })
  }
)

export default compose(requestAccess, withSignIn, withMe, withT)(Trial)
