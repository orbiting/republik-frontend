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
import withMembership from '../Auth/withMembership'
import SwitchBoard from '../Auth/SwitchBoard'
import Consents, { getConsentsError } from '../Pledge/Consents'
import { Router } from '../../lib/routes'
import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import { MdArrowForward } from 'react-icons/md'
import {
  Button,
  Field,
  InlineSpinner,
  colors,
  mediaQueries
} from '@project-r/styleguide'
import { withRouter } from 'next/router'
import { getUtmParams } from '../../lib/utils/url'

const styles = {
  errorMessages: css({
    color: colors.error,
    marginTop: 40
  }),
  switchBoard: css({
    marginTop: 40
  }),
  switchBoardMinimal: css({
    marginTop: 0
  }),
  button: css({
    marginTop: 40,
    width: 170,
    textAlign: 'center'
  }),
  buttonRow: css({
    display: 'flex',
    flexDirection: 'column',
    '& :first-child': {
      margin: '0 0 10px'
    },
    [mediaQueries.mUp]: {
      display: 'inherit',
      '& :first-child': {
        margin: '0 10px 0 0'
      }
    }
  })
}

const REQUIRED_CONSENTS = ['PRIVACY']

const Form = props => {
  const {
    payload,
    router: { query },
    beforeSignIn,
    onSuccess,
    narrow,
    trialEligibility,
    isMember,
    me,
    meRefetch,
    t,
    minimal,
    darkMode,
    initialEmail
  } = props
  const { viaActiveMembership, viaAccessGrant } = trialEligibility

  const utmParams = getUtmParams(query)

  const [consents, setConsents] = useState(query.token ? REQUIRED_CONSENTS : [])
  const [email, setEmail] = useState({ value: initialEmail || '' })
  const [serverError, setServerError] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [loading, setLoading] = useState(false)

  const [switchBoardProps, setSwitchBoardProps] = useState()

  const [showErrors, setShowErrors] = useState(false)
  const [autoRequestAccess, setAutoRequestAccess] = useState(false)

  useEffect(() => {
    autoRequestAccess && !signingIn && me && requestAccess()
  }, [autoRequestAccess, signingIn])

  const handleEmail = (value, shouldValidate) => {
    setEmail({
      ...email,
      value,
      error:
        ((!value || value.trim().length <= 0) &&
          t('Trial/Form/email/error/empty')) ||
        (!isEmail(value) && t('Trial/Form/email/error/invalid')),
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

      if (!email.value || email.error || consentErrors) {
        setLoading(false)
        return setShowErrors(true)
      }

      beforeSignIn && beforeSignIn()

      return props
        .signIn(email.value, 'trial', consents, 'EMAIL_CODE', query.token)
        .then(({ data: { signIn } }) => {
          setSwitchBoardProps({
            ...signIn,
            accessToken: query.token
          })

          setLoading(false)
          setSigningIn(true)
          setAutoRequestAccess(true)
        })
        .catch(catchError)
    }

    setSigningIn(false)

    if (!isMember) {
      props
        .requestAccess({ payload: { ...payload, ...utmParams } })
        .then(() => {
          const shouldRedirect = onSuccess ? onSuccess() : true
          if (shouldRedirect) {
            window.location = format({
              pathname: `/einrichten`,
              query: { context: 'trial' }
            })
          } else {
            minimal && setShowButtons(true)
            meRefetch()
          }
        })
        .catch(catchError)
    }
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

  if (
    showButtons ||
    viaActiveMembership.until ||
    viaAccessGrant.until ||
    isMember
  ) {
    return (
      <div {...styles.buttonRow} style={narrow ? { marginTop: 20 } : undefined}>
        <Button primary onClick={() => Router.pushRoute('index')}>
          {t('Trial/Form/authorized/withAccess/button/label')}
        </Button>
        <Button
          white={minimal && darkMode}
          secondary={minimal && !darkMode}
          onClick={() => Router.pushRoute('onboarding', { context: 'trial' })}
        >
          {t('Trial/Form/authorized/withAccess/setup/label')}
        </Button>
      </div>
    )
  }

  const consentErrors = getConsentsError(t, REQUIRED_CONSENTS, consents)

  const errorMessages = [email.error].concat(consentErrors).filter(Boolean)

  return (
    <Fragment>
      {!(signingIn && minimal) && (
        <form onSubmit={requestAccess}>
          {!me && (
            <div
              style={{
                opacity: signingIn ? 0.6 : 1,
                marginTop: narrow || minimal ? 0 : 20
              }}
            >
              <Field
                name='email'
                type='email'
                black={minimal && !darkMode}
                white={minimal && darkMode}
                label={t('Trial/Form/email/label')}
                value={email.value}
                error={email.dirty && email.error}
                dirty={email.dirty}
                disabled={signingIn}
                icon={
                  minimal &&
                  (loading ? (
                    <InlineSpinner size='30px' />
                  ) : (
                    <MdArrowForward
                      style={{ cursor: 'pointer' }}
                      size={30}
                      onClick={requestAccess}
                    />
                  ))
                }
                onChange={(_, value, shouldValidate) =>
                  handleEmail(value, shouldValidate)
                }
              />
              <div
                style={{ marginTop: (narrow && 10) || (minimal && '0') || 40 }}
              >
                <Consents
                  darkMode={darkMode}
                  error={showErrors && consentErrors}
                  required={REQUIRED_CONSENTS}
                  accepted={consents}
                  disabled={signingIn}
                  onChange={setConsents}
                />
              </div>
            </div>
          )}

          {!minimal && showErrors && errorMessages.length > 0 && (
            <div {...styles.errorMessages}>
              {t('Trial/Form/error/title')}
              <br />
              <ul>
                {errorMessages.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {!signingIn && !minimal && (
            <div {...merge(styles.button, narrow && { marginTop: 20 })}>
              {loading ? (
                <InlineSpinner />
              ) : (
                <Button
                  primary
                  type='submit'
                  block
                  onClick={requestAccess}
                  disabled={showErrors && errorMessages.length > 0}
                >
                  {t(
                    `Trial/Form/${
                      me ? 'authorized' : 'unauthorized'
                    }/withoutAccess/button/label`
                  )}
                </Button>
              )}
            </div>
          )}
        </form>
      )}

      {signingIn && (
        <div
          {...merge(styles.switchBoard, minimal && styles.switchBoardMinimal)}
        >
          <SwitchBoard
            email={email.value}
            {...switchBoardProps}
            alternativeFirstFactors={[]}
            onCancel={reset}
            onTokenTypeChange={reset}
            onSuccess={onSuccessSwitchBoard}
            minimal={minimal}
            darkMode={darkMode}
          />
        </div>
      )}

      {serverError && <ErrorMessage error={serverError} />}
    </Fragment>
  )
}

Form.propTypes = {
  accessCampaignId: PropTypes.string.isRequired,
  beforeSignIn: PropTypes.func,
  narrow: PropTypes.bool
}

const REQUEST_ACCESS = gql`
  mutation requestAccess($campaignId: ID!, $payload: JSON) {
    requestAccess(campaignId: $campaignId, payload: $payload) {
      id
      endAt
    }
  }
`

const withRequestAccess = graphql(REQUEST_ACCESS, {
  props: ({ mutate, ownProps: { accessCampaignId } }) => ({
    requestAccess: ({ payload }) =>
      mutate({
        variables: { campaignId: accessCampaignId, payload }
      })
  })
})

export default compose(
  withTrialEligibility,
  withMembership,
  withRequestAccess,
  withSignIn,
  withRouter,
  withMe,
  withT
)(Form)
