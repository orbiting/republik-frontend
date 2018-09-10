import React, { Fragment, Component } from 'react'
import { css } from 'glamor'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Button, A,
  InlineSpinner, Loader,
  Interaction, Label,
  fontFamilies, colors
} from '@project-r/styleguide'

import Consents, { getConsentsError } from '../Pledge/Consents'
import Fields, { getFieldsError, validateField } from './Fields'

import withT from '../../lib/withT'
import { meQuery } from '../../lib/apollo/withMe'
import { Router } from '../../lib/routes'

import ErrorMessage from '../ErrorMessage'

import Me from './Me'

const styles = {
  actions: css({
    textAlign: 'center'
  })
}

const { P } = Interaction

const goTo = (type, email, context) => Router.replaceRoute(
  'notifications',
  { type, email, context }
)

const shouldAutoAuthorize = ({ error, target, noAutoAuthorize }) => {
  return (
    !error &&
    target &&
    target.session.isCurrent &&
    !target.requiredConsents.length &&
    !target.requiredFields.length &&
    !noAutoAuthorize
  )
}

class TokenAuthorization extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fields: {}
    }

    this.getAuthorizeFields = () => {
      const fields = {}

      Object.keys(this.state.fields).forEach(key => {
        fields[key] = this.state.fields[key].value
      })

      return Object.keys(fields).length > 0 ? fields : null
    }
  }
  authorize () {
    if (this.state.authorizing) {
      return
    }

    const {
      email,
      authorize,
      context
    } = this.props

    this.setState({
      authorizing: true
    }, () => {
      authorize({
        consents: this.state.consents,
        fields: this.getAuthorizeFields()
      })
        .then(() => goTo('email-confirmed', email, context))
        .catch(error => {
          this.setState({
            authorizing: false,
            authorizeError: error
          })
        })
    })
  }
  deny () {
    if (this.state.authorizing) {
      return
    }

    const {
      email,
      deny,
      context
    } = this.props

    this.setState({
      authorizing: true
    }, () => {
      deny()
        .then(() => goTo('session-denied', email, context))
        .catch(error => {
          this.setState({
            authorizing: false,
            authorizeError: error
          })
        })
    })
  }
  autoAuthorize () {
    if (!this.state.authorizing && shouldAutoAuthorize(this.props)) {
      this.authorize()
    }
  }
  componentDidMount () {
    this.autoAuthorize()
  }
  componentDidUpdate () {
    this.autoAuthorize()
  }
  render () {
    const {
      t,
      target,
      echo,
      email,
      error,
      loading,
      noAutoAuthorize
    } = this.props
    const {
      consents,
      fields
    } = this.state

    if (error) {
      return (
        <Fragment>
          <P>
            {t('tokenAuthorization/error')}
          </P>
          <ErrorMessage error={error} />
          <div style={{marginTop: 80, marginBottom: 80}}>
            <Me email={email} />
          </div>
        </Fragment>
      )
    }

    return (
      <Loader loading={loading || shouldAutoAuthorize(this.props)} render={() => {
        const consentsError = getConsentsError(
          t,
          target.requiredConsents,
          consents
        )

        const fieldsError = getFieldsError(
          t,
          target.requiredFields,
          fields
        )

        const authorizeError = this.state.authorizeError || (
          this.state.dirty && (consentsError || fieldsError)
        )

        const { country, city, ipAddress, userAgent, phrase, isCurrent } = target.session
        const showSessionInfo = !isCurrent || noAutoAuthorize
        return (
          <Fragment>
            {!showSessionInfo &&
              <P>
                {t(`tokenAuthorization/title/${target.newUser ? 'new' : 'existing'}`, { email })}
              </P>}
            {showSessionInfo && <div style={{margin: '20px 0'}}>
              <P>
                {t('tokenAuthorization/differentSession', { email })}
              </P>
              <P style={{
                fontFamily: userAgent !== echo.userAgent
                  ? fontFamilies.sansSerifMedium
                  : undefined
              }}>
                {userAgent}
              </P>
              <P>
                <Label>{t('tokenAuthorization/location')}</Label><br />
                {!!city && <span style={{
                  fontFamily: city !== echo.city
                    ? fontFamilies.sansSerifMedium
                    : undefined
                }}>
                  {city}{', '}
                </span>}
                <span style={
                  country !== echo.country
                    ? {
                      fontFamily: fontFamilies.sansSerifMedium,
                      color: colors.error
                    }
                    : {}
                }>
                  {country || t('tokenAuthorization/location/unknown')}
                </span>
              </P>
              {echo.ipAddress !== ipAddress && <P>
                <Label>{t('tokenAuthorization/ip')}</Label><br />
                {ipAddress}
              </P>}
              <P>
                <Label>{t('tokenAuthorization/phrase')}</Label><br />
                <span style={{
                  fontFamily: !isCurrent
                    ? fontFamilies.sansSerifMedium
                    : undefined
                }}>
                  {phrase}
                </span>
              </P>
            </div>}
            {!!target.requiredFields.length && (
              <Fields
                fields={fields}
                required={target.requiredFields}
                onChange={(event, value, shouldValidate) => {
                  const field = event.currentTarget.name

                  this.setState({
                    fields: Object.assign({}, fields, { [event.currentTarget.name]: {
                      value,
                      error: shouldValidate && validateField(t, field, value)
                    }}),
                    authorizeError: undefined
                  })
                }} />
            )}
            {!!target.requiredConsents.length && (
              <div style={{margin: '20px 0', textAlign: 'left'}}>
                <Consents
                  accepted={consents}
                  required={target.requiredConsents}
                  onChange={keys => {
                    this.setState({
                      consents: keys,
                      authorizeError: undefined
                    })
                  }} />
              </div>
            )}
            {!!authorizeError && <ErrorMessage error={authorizeError} />}
            <br />
            {this.state.authorizing
              ? <div style={{textAlign: 'center'}}><InlineSpinner /></div>
              : (
                <div {...styles.actions}>
                  <div style={{
                    opacity: consentsError ? 0.5 : 1,
                    marginBottom: 15
                  }}>
                    <Button
                      primary
                      style={{minWidth: 250}}
                      onClick={() => {
                        if (consentsError || fieldsError) {
                          this.setState({dirty: true})
                          return
                        }
                        this.authorize()
                      }}>
                      {t('tokenAuthorization/grant')}
                    </Button>
                  </div>
                  <A
                    style={{minWidth: 250}}
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      this.deny()
                    }}>
                    {t('tokenAuthorization/deny')}
                  </A>
                </div>
              )}
            <br />
            <br />
            <Label>{t('tokenAuthorization/after')}</Label>
            <br />
            <br />
          </Fragment>
        )
      }} />
    )
  }
}

const authorizeSession = gql`
  mutation authorizeSession(
    $email: String!
    $tokens: [SignInToken!]!
    $consents: [String!]
    $fields: RequiredUserFields
  ) {
    authorizeSession(
      email: $email
      tokens: $tokens
      consents: $consents
      fields: $fields
    )
  }
`
const denySession = gql`
  mutation denySession($email: String!, $token: SignInToken!) {
    denySession(email: $email, token: $token)
  }
`

const unauthorizedSessionQuery = gql`
  query unauthorizedSession($email: String!, $token: String!, $tokenType: SignInTokenType!) {
    echo {
      ipAddress
      userAgent
      country
      city
    }
    target: unauthorizedSession(email: $email, token: {type: $tokenType, payload: $token}) {
      newUser
      enabledSecondFactors
      requiredConsents
      requiredFields
      session {
        ipAddress
        userAgent
        country
        city
        phrase
        isCurrent
      }
    }
  }
`

export default compose(
  withT,
  graphql(authorizeSession, {
    props: ({ ownProps: { email, token, tokenType }, mutate }) => ({
      authorize: ({ consents, fields } = {}) => mutate({
        variables: {
          email,
          tokens: [
            {type: tokenType, payload: token}
          ],
          consents,
          fields
        },
        refetchQueries: [{query: meQuery}]
      })
    })
  }),
  graphql(denySession, {
    props: ({ ownProps: { email, token, tokenType }, mutate }) => ({
      deny: () => mutate({
        variables: {
          email,
          token: {type: tokenType, payload: token}
        },
        refetchQueries: [{query: meQuery}]
      })
    })
  }),
  graphql(unauthorizedSessionQuery, {
    props: ({ data }) => {
      return {
        target: data.target,
        echo: data.echo,
        loading: data.loading,
        error: data.error
      }
    },
    options: {
      // no server rendering for proper echo
      ssr: false
    }
  })
)(TokenAuthorization)
