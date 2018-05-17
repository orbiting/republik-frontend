import React, { Fragment, Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Button, InlineSpinner, Interaction, Label, Loader, fontFamilies, colors } from '@project-r/styleguide'

import withT from '../../lib/withT'
import { meQuery } from '../../lib/apollo/withMe'
import { Router } from '../../lib/routes'

import { errorToString } from '../../lib/utils/errors'

const { P } = Interaction

const goTo = (type, email) => Router.replaceRoute(
  'notifications',
  { type, email, context: 'authorization' }
)

const shouldAutoAuthorize = ({ isCurrent }) => {
  return isCurrent
}

class TokenAuthorization extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  authorize () {
    const {
      email,
      authorize
    } = this.props

    if (this.state.authorizing) {
      return
    }
    this.setState({
      authorizing: true
    }, () => {
      authorize()
        .then(() => goTo('email-confirmed', email))
        .catch(error => {
          this.setState({
            authorizeError: errorToString(error)
          })
        })
    })
  }
  autoAutherize () {
    const {
      email,
      error
    } = this.props

    if (!this.state.authorizing && shouldAutoAuthorize(this.props)) {
      this.authorize()
    } else if (error) {
      goTo('invalid-token', email, error)
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
      authorizeError
    } = this.state

    return (
      <Loader error={authorizeError} loading={loading || error || shouldAutoAuthorize(this.props)} render={() => {
        const { country, city, ipAddress, userAgent } = target
        return (
          <Fragment>
            <P>{t('notifications/authorization/text/before', { email })}</P>
            <div style={{margin: '20px 0'}}>
              <P>
                <Label>{t('notifications/authorization/location')}</Label><br />
                <span style={
                  country !== echo.country
                    ? {
                      fontFamily: fontFamilies.sansSerifMedium,
                      color: colors.error
                    }
                    : {}
                }>
                  {country || t('notifications/authorization/location/unknown')}
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
                <Label>{t('notifications/authorization/device')}</Label><br />
                <span style={{
                  fontFamily: userAgent !== echo.userAgent
                    ? fontFamilies.sansSerifMedium
                    : undefined
                }}>
                  {userAgent}
                </span>
              </P>
              {echo.ipAddress !== ipAddress && <P>
                <Label>{t('notifications/authorization/ip')}</Label><br />
                {ipAddress}
              </P>}
            </div>
            <br />
            {this.state.authorizing
              ? <div style={{textAlign: 'center'}}><InlineSpinner /></div>
              : <Button primary onClick={() => this.authorize()}>
                {t('notifications/authorization/button')}
              </Button>}
            <br />
            <br />
            <Label>{t('notifications/authorization/text/after', { email })}</Label>
          </Fragment>
        )
      }} />
    )
  }
}

const authorizeSession = gql`
  mutation authorizeSession($email: String!, $token: String!) {
    authorizeSession(email: $email, tokens: [{type: EMAIL_TOKEN, payload: $token}])
  }
`

const unauthorizedSessionQuery = gql`
  query unauthorizedSession($email: String!, $token: String!) {
    echo {
      ipAddress
      userAgent
      country
      city
    }
    unauthorizedSession(email: $email, token: {type: EMAIL_TOKEN, payload: $token}) {
      enabledSecondFactors
      session {
        ipAddress
        userAgent
        country
        city
        isCurrent
      }
    }
  }
`

export default compose(
  withT,
  graphql(authorizeSession, {
    props: ({ ownProps: { email, token }, mutate, ...test }) => ({
      authorize: () => mutate({
        variables: { email, token },
        refetchQueries: [{query: meQuery}]
      })
    })
  }),
  graphql(unauthorizedSessionQuery, {
    props: ({ data }) => {
      const {
        enabledSecondFactors,
        session
      } = data.unauthorizedSession || {}
      return {
        enabledSecondFactors,
        target: session,
        echo: data.echo,
        isCurrent: session && session.isCurrent,
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
