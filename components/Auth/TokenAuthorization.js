import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Button, P, Label, H2, H1 } from '@project-r/styleguide'
import withT from '../../lib/withT'

const TokenAuthorization = ({ t, unauthorizedSession, email, token }) => {
  const { country, city, ipAddress, userAgent, countryFlag } = unauthorizedSession || {}
  return (
    <React.Fragment>
      <H1>{t('notifications/authorization/title')}</H1>
      <P>{t('notifications/authorization/text', { email })}</P>
      {ipAddress && (
        <React.Fragment>
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
          <Button primary onClick={() => {}}>
            {t('notifications/authorization/button')}
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const authorizeSession = gql`
  mutation authorizeSession($email: String!, $token: String!) {
    authorizeSession(email: $email, token: $token)
  }
`

export const unauthorizedSessionQuery = gql`
  query unauthorizedSession($email: String!, $token: String!) {
    unauthorizedSession(email: $email, token: $token) {
      ipAddress
      userAgent
      country
      countryFlag
      city
    }
  }
`

export default compose(
  graphql(unauthorizedSessionQuery, {
    props: ({ data }) => {
      return {
        unauthorizedSession: data.unauthorizedSession
      }
    }
  }),
  graphql(authorizeSession, {
    props: ({ email, token, mutate }) => ({
      authorize: () =>
        mutate({ email, token })
    })
  }),
  withT
)(TokenAuthorization)
