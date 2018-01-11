import React, { Fragment, Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Button, InlineSpinner, Interaction, Label, Loader } from '@project-r/styleguide'

import withT from '../../lib/withT'
import { meQuery } from '../../lib/apollo/withMe'
import { Router } from '../../lib/routes'

const { P } = Interaction

const goTo = (type, email) => Router.replaceRoute(
  'notifications',
  { type, email, context: 'authorization' }
)

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
    this.setState({
      authorizing: true
    })
    authorize()
      .then(() => goTo('email-confirmed', email))
      .catch(error => goTo('invalid-token', email, error))
  }
  autoAutherize () {
    const {
      isCurrent,
      email,
      error
    } = this.props

    if (!this.state.authorizing && isCurrent) {
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
      unauthorizedSession,
      isCurrent,
      email,
      error, loading
    } = this.props

    return (
      <Loader loading={loading || error || isCurrent} render={() => {
        const { country, city, ipAddress, userAgent } = unauthorizedSession

        return (
          <Fragment>
            <P>{t('notifications/authorization/text', { email })}</P>
            <Label>{t('notifications/authorization/location')}</Label>
            <P>
              {country || t('notifications/authorization/location/unknown')}<br />
              {city}
            </P>
            <Label>{t('notifications/authorization/device')}</Label>
            <P>
              {ipAddress}<br />
              {userAgent}
            </P>
            <br />
            {this.state.authorizing
              ? <div style={{textAlign: 'center'}}><InlineSpinner /></div>
              : <Button primary onClick={() => this.authorize()}>
                {t('notifications/authorization/button')}
              </Button>}
          </Fragment>
        )
      }} />
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
