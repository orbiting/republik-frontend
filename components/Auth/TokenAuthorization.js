import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import { Button, P, Label, H2, H1, Loader } from '@project-r/styleguide'
import withT from '../../lib/withT'
import { meQuery } from '../../lib/apollo/withMe'

const TokenAuthorization = ({ t, unauthorizedSession, email, token, error, loading, requestInfo, authorize }) => {
  const { country, city, ipAddress, userAgent, countryFlag } = unauthorizedSession || {}

  if (error) {
    Router.replace({
      pathname: '/notifications',
      query: {
        type: 'invalid-token',
        emailFromQuery: email
      }
    })
  }

  const { userAgent: reqUserAgent, ipAddress: reqIpAddress } = requestInfo
  const reqKey = `${reqUserAgent}${reqIpAddress}`
  const sessionKey = `${userAgent}${ipAddress}`
  const isSameDevice = (sessionKey === reqKey)
  if (process.browser) {
    console.debug(reqKey, sessionKey, `same device: ${isSameDevice}`)
    if (error) {
      Router.replace({
        pathname: '/notifications',
        query: {
          type: 'invalid-token',
          emailFromQuery: email
        }
      })
    } else if (isSameDevice) {
      // auto trigger token authorization
      authorize()
    }
  }

  return (
    <React.Fragment>
      <H1>{t('notifications/authorization/title')}</H1>
      <P>{t('notifications/authorization/text', { email })}</P>
      <Loader loading={loading} />
      {(ipAddress && !isSameDevice) && (
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
          <Button primary onClick={authorize}>
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
  withT,
  graphql(authorizeSession, {
    props: ({ ownProps: { email, token }, mutate, ...test }) => ({
      authorize: () => {
        mutate({
          variables: { email, token },
          refetchQueries: [{query: meQuery}]
        }).then(({ data }) => {
          Router.replace({
            pathname: '/notifications',
            query: {
              type: 'email-confirmed',
              email
            }
          })
        })
        .catch(error => {
          console.log(error)
          Router.replace({
            pathname: '/notifications',
            query: {
              type: 'invalid-token',
              emailFromQuery: email
            }
          })
        })
      }
    })
  }),
  graphql(unauthorizedSessionQuery, {
    props: ({ data }) => {
      return {
        unauthorizedSession: data.unauthorizedSession,
        loading: data.loading,
        error: data.error
      }
    }
  })
)(TokenAuthorization)
