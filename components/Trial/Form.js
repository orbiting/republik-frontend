import React, { useState, useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { css, merge } from 'glamor'
import isEmail from 'validator/lib/isEmail'
import { format } from 'url'

import withTrialEligibility from './withTrialEligibility'
import ErrorMessage from '../ErrorMessage'
import { withSignIn } from '../Auth/SignIn'
import SwitchBoard from '../Auth/SwitchBoard'
import Consents, { getConsentsError } from '../Pledge/Consents'
import { Router } from '../../lib/routes'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import { Button, Field, InlineSpinner, colors } from '@project-r/styleguide'

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
    width: 170,
    textAlign: 'center'
  }),
  buttonIndex: css({
    width: 210
  })
}

const REQUIRED_CONSENTS = ['PRIVACY', 'TOS']

const Form = (props) => {
  const { beforeRequestAccess, narrow, trialEligibility, me, t } = props
  const { viaActiveMembership, viaAccessGrant } = trialEligibility

  if (viaActiveMembership.until || viaAccessGrant.until) {
    return (
      <div {...merge(styles.button, styles.buttonIndex, narrow && { marginTop: 20 })}>
        <Button
          primary
          block
          onClick={() => Router.pushRoute('index')}>
          {t('Trial/Form/authorized/withAccess/button/label')}
        </Button>
      </div>
    )
  }

  const [consents, setConsents] = useState([])
  const [email, setEmail] = useState({ value: '' })
  const [serverError, setServerError] = useState('')
  const [phrase, setPhrase] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tokenType, setTokenType] = useState('EMAIL_CODE')
  const [showErrors, setShowErrors] = useState(false)
  const [autoRequestAccess, setAutoRequestAccess] = useState(false)
  const [autoRedirectOnboarding, setAutoRedirectOnboarding] = useState(false)

  useEffect(
    () => { autoRequestAccess && !signingIn && me && requestAccess() },
    [autoRequestAccess, signingIn]
  )

  useEffect(
    () => {
      if (autoRedirectOnboarding) {
        window.location = format({
          pathname: `/einrichten`,
          query: { context: 'trial' }
        })
      }
    },
    [autoRedirectOnboarding]
  )

  const handleEmail = (value, shouldValidate) => {
    setEmail({
      ...email,
      value,
      error: (
        (value.trim().length <= 0 && t('Trial/Form/email/error/empty')) ||
        (!isEmail(value) && t('Trial/Form/email/error/invalid'))
      ),
      dirty: shouldValidate
    })
  }

  const requestAccess = e => {
    e && e.preventDefault && e.preventDefault()

    setLoading(true)
    setAutoRequestAccess(false)
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
          setAutoRequestAccess(true)
        })
        .catch(catchError)
    }

    setSigningIn(false)

    beforeRequestAccess && beforeRequestAccess()

    props.requestAccess()
      .then(() => setAutoRedirectOnboarding(true))
      .catch(catchError)
  }

  const catchError = error => {
    setServerError(error)
    reset()
  }

  const reset = e => {
    e && e.preventDefault && e.preventDefault()

    setLoading(false)
    setSigningIn(false)
  }

  const onSuccessSwitchBoard = () => {
    setSigningIn(false)
  }

  const errorMessages = [email.error]
    .concat(getConsentsError(t, REQUIRED_CONSENTS, consents))
    .filter(Boolean)

  return (
    <Fragment>
      <form onSubmit={requestAccess}>
        {!me && (
          <div style={{ opacity: (signingIn) ? 0.6 : 1, marginTop: narrow ? 0 : 20 }}>
            <Field
              label={t('Trial/Form/email/label')}
              value={email.value}
              error={email.dirty && email.error}
              dirty={email.dirty}
              disabled={signingIn}
              onChange={(_, value, shouldValidate) => handleEmail(value, shouldValidate)} />
            <div style={{ marginTop: narrow ? 10 : 40 }}>
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
            {t('Trial/Form/error/title')}<br />
            <ul>
              {errorMessages.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {!signingIn && (
          <div {...merge(styles.button, narrow && { marginTop: 20 })}>
            {loading
              ? <InlineSpinner />
              : <Button
                primary
                type='submit'
                block
                onClick={requestAccess}
                disabled={showErrors && errorMessages.length > 0}>
                {t(`Trial/Form/${me ? 'authorized' : 'unauthorized'}/withoutAccess/button/label`)}
              </Button>
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
            onSuccess={onSuccessSwitchBoard} />
        </div>
      )}

      {serverError && <ErrorMessage error={serverError} />}

    </Fragment>
  )
}

Form.propTypes = {
  accessCampaignId: PropTypes.string.isRequired,
  beforeRequestAccess: PropTypes.func,
  narrow: PropTypes.bool
}

const REQUEST_ACCESS = gql`
  mutation requestAccess($campaignId: ID!) {
    requestAccess(campaignId: $campaignId) {
      id
      endAt
    }
  }
`

const withRequestAccess = graphql(
  REQUEST_ACCESS,
  {
    props: ({ mutate, ownProps: { accessCampaignId } }) => ({
      requestAccess: () => mutate({
        variables: { campaignId: accessCampaignId }
      })
    })
  }
)

export default compose(withTrialEligibility, withRequestAccess, withSignIn, withMe, withT)(Form)
