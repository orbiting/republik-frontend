import React, { Fragment, Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Button, P, Label, H2, H1, Loader } from '@project-r/styleguide'

import withT from '../../lib/withT'
import { meQuery } from '../../lib/apollo/withMe'
import { Router } from '../../lib/routes'

const goTo = (type, email) => Router.replaceRoute(
  'notifications',
  { type, emailFromQuery: email }
)

class TokenAuthorization extends Component {
  autoAutherize () {
    const {
      isCurrent,
      email,
      authorize,
      error
    } = this.props

    if (!this.pending && isCurrent) {
      this.pending = authorize()
        .then(() => {
          goTo('email-confirmed', email)
        })
        .catch(error => {
          goTo('invalid-token', email, error)
        })
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
      unauthorizedSession,
      isCurrent,
      email,
      error, loading,
      authorize
    } = this.props

    return (
      <Fragment>
        <H1>{t('notifications/authorization/title')}</H1>
        <P>{t('notifications/authorization/text', { email })}</P>
        <Loader loading={loading || error || isCurrent} render={() => {
          const { country, city, ipAddress, userAgent, countryFlag } = unauthorizedSession

          return (
            <Fragment>
              <div>
                <H2>{t('notifications/authorization/location')}</H2>
                <H1>{countryFlag}</H1>
                <Label>{country || t('notifications/authorization/location/unknown')}</Label>
                <Label>{city}</Label>
                <H2>{t('notifications/authorization/device')}</H2>
                <P>{ipAddress}</P>
                <Label>{userAgent}</Label>
              </div>
              <br />
              <Button primary onClick={authorize}>
                {t('notifications/authorization/button')}
              </Button>
            </Fragment>
          )
        }} />
      </Fragment>
    )
  }
}

const authorizeSession = gql`
  mutation authorizeSession($email: String!, $token: String!) {
    authorizeSession(email: $email, token: $token)
  }
`

const unauthorizedSessionQuery = gql`
  query unauthorizedSession($email: String!, $token: String!) {
    unauthorizedSession(email: $email, token: $token) {
      ipAddress
      userAgent
      country
      countryFlag
      city
      isCurrent
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
      return {
        unauthorizedSession: data.unauthorizedSession,
        isCurrent: data.unauthorizedSession && data.unauthorizedSession.isCurrent,
        loading: data.loading,
        error: data.error
      }
    }
  })
)(TokenAuthorization)
