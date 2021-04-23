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

import { ArrowForwardIcon } from '@project-r/styleguide/icons'
import {
  Button,
  Field,
  InlineSpinner,
  useColorContext
} from '@project-r/styleguide'
import { withRouter } from 'next/router'
import { getConversionPayload } from '../../lib/utils/track'

const styles = {
  errorMessages: css({
    marginTop: 40
  }),
  switchBoard: css({
    marginTop: 40
  }),
  switchBoardMinimal: css({
    marginTop: 0
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
    initialEmail,
    campaign
  } = props
  const { viaActiveMembership, viaAccessGrant } = trialEligibility

  const [consents, setConsents] = useState(query.token ? REQUIRED_CONSENTS : [])
  const [email, setEmail] = useState({ value: initialEmail || '' })
  const [serverError, setServerError] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [loading, setLoading] = useState(false)

  const [switchBoardProps, setSwitchBoardProps] = useState()

  const [showErrors, setShowErrors] = useState(false)
  const [autoRequestAccess, setAutoRequestAccess] = useState(false)
  const [colorScheme] = useColorContext()

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
        .requestAccess({
          payload: { ...getConversionPayload(query), ...payload }
        })
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
      <div style={{ marginTop: narrow ? 20 : 40 }}>
        <Button
          primary
          onClick={() => Router.pushRoute('index')}
          style={{ marginRight: 10 }}
        >
          {t('Trial/Form/withAccess/button/label')}
        </Button>
        <Button
          onClick={() => Router.pushRoute('onboarding', { context: 'trial' })}
        >
          {t('Trial/Form/withAccess/setup/label')}
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
                    <ArrowForwardIcon
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
                style={{ marginTop: (narrow && 10) || (minimal && '0') || 20 }}
              >
                <Consents
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
            <div
              {...styles.errorMessages}
              {...colorScheme.set('color', 'error')}
            >
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
            <div style={{ marginTop: narrow ? 20 : 30 }}>
              {loading ? (
                <InlineSpinner />
              ) : (
                <Button
                  primary
                  type='submit'
                  onClick={requestAccess}
                  disabled={showErrors && errorMessages.length > 0}
                >
                  {t.first(
                    [
                      campaign &&
                        me &&
                        `Trial/Form/${campaign}/button/signedIn`,
                      campaign && `Trial/Form/${campaign}/button`,
                      me && `Trial/Form/button/signedIn`,
                      `Trial/Form/button`
                    ].filter(Boolean)
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
          />
        </div>
      )}

      {serverError && <ErrorMessage error={serverError} />}
    </Fragment>
  )
}

Form.propTypes = {
  campaign: PropTypes.string,
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
