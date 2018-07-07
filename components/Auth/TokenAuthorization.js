import React, { Fragment, Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Button, InlineSpinner, Interaction, Label, Loader, fontFamilies, colors } from '@project-r/styleguide'

import Consents, { getConsentsError } from '../Pledge/Consents'

import withT from '../../lib/withT'
import { meQuery } from '../../lib/apollo/withMe'
import { Router } from '../../lib/routes'

import ErrorMessage from '../ErrorMessage'

import Me from './Me'

const { P } = Interaction

const goTo = (type, email) => Router.replaceRoute(
  'notifications',
  { type, email, context: 'authorization' }
)

const shouldAutoAuthorize = ({ error, target }) => {
  return (
    !error &&
    target &&
    target.session.isCurrent &&
    !target.requiredConsents.length
  )
}

class TokenAuthorization extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  authorize () {
    if (this.state.authorizing) {
      return
    }

    const {
      email,
      authorize
    } = this.props

    this.setState({
      authorizing: true
    }, () => {
      authorize({
        consents: this.state.consents
      })
        .then(() => goTo('email-confirmed', email))
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
      deny
    } = this.props

    this.setState({
      authorizing: true
    }, () => {
      deny()
        .then(() => goTo('session-denied', email))
        .catch(error => {
          this.setState({
            authorizing: false,
            authorizeError: error
          })
        })
    })
  }
  autoAutherize () {
    if (!this.state.authorizing && shouldAutoAuthorize(this.props)) {
      this.authorize()
    }
  }
  componentDidMount () {
    this.autoAutherize()
  }
  componentDidUpdate () {
    this.autoAutherize()
  }
  render () {
    const {
      t,
      target,
      echo,
      email,
      error,
      loading
    } = this.props
    const {
      consents
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
        const authorizeError = this.state.authorizeError || (
          this.state.dirty && consentsError
        )
        const { country, city, ipAddress, userAgent, phrase, isCurrent } = target.session
        return (
          <Fragment>
            <P>
              {t(`tokenAuthorization/title/${target.newUser ? 'new' : 'existing'}`)}<br />
              <Label>{t('tokenAuthorization/email', { email })}</Label>
            </P>
            {!isCurrent && <div style={{margin: '20px 0'}}>
              <P>
                {t('tokenAuthorization/differentSession')}
              </P>
              <P>
                <Label>{t('tokenAuthorization/phrase')}</Label><br />
                <span>
                  {phrase}
                </span>
              </P>
              <P>
                <Label>{t('tokenAuthorization/location')}</Label><br />
                <span style={
                  country !== echo.country
                    ? {
                      fontFamily: fontFamilies.sansSerifMedium,
                      color: colors.error
                    }
                    : {}
                }>
                  {country || t('tokenAuthorization/location/unknown')}
                </span><br />
                <span style={{
                  fontFamily: city !== echo.city
                    ? fontFamilies.sansSerifMedium
                    : undefined
                }}>
                  {city}
                </span>
              </P>
              <P>
                <Label>{t('tokenAuthorization/device')}</Label><br />
                <span style={{
                  fontFamily: userAgent !== echo.userAgent
                    ? fontFamilies.sansSerifMedium
                    : undefined
                }}>
                  {userAgent}
                </span>
              </P>
              {echo.ipAddress !== ipAddress && <P>
                <Label>{t('tokenAuthorization/ip')}</Label><br />
                {ipAddress}
              </P>}
            </div>}
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
                <div style={{opacity: consentsError ? 0.5 : 1}}>
                  <Button
                    primary
                    onClick={() => {
                      if (consentsError) {
                        this.setState({dirty: true})
                        return
                      }
                      this.authorize()
                    }}>
                    {t(`tokenAuthorization/button${!isCurrent ? '/differentSession' : ''}`)}
                  </Button>
                  {!target.requiredConsents.length && !isCurrent && (
                    <div>
                      <br />
                      <Button
                        black
                        onClick={() => {
                          this.deny()
                        }}>
                        {t(`tokenAuthorization/button/deny`)}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            <br />
            <br />
            <Label>{t('tokenAuthorization/after', { email })}</Label>
          </Fragment>
        )
      }} />
    )
  }
}

const authorizeSession = gql`
  mutation authorizeSession($email: String!, $tokens: [SignInToken!]!, $consents: [String!]) {
    authorizeSession(email: $email, tokens: $tokens, consents: $consents)
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
      authorize: ({consents} = {}) => mutate({
        variables: {
          email,
          tokens: [
            {type: tokenType, payload: token}
          ],
          consents
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
