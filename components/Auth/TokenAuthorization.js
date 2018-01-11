import React from 'react'
import { compose } from 'react-apollo'
import {
  Button, P, Label, H2, H1
} from '@project-r/styleguide'

import withUnauthorizedSession from '../../lib/apollo/withUnauthorizedSession'
import withT from '../../lib/withT'

const TokenAuthorization = ({ t, unauthorizedSession, email, token }) => {
  const { country, city, ipAddress, userAgent, countryFlag } = unauthorizedSession || {}
  return (
    <React.Fragment>
      <H1>Sign-in Request</H1>
      <P>
        Somebody wants to sign in at republik.ch with your e-mail address {email || ''}. If that's not you, contact us at support@republik.ch
      </P>
      {ipAddress && (
        <React.Fragment>
          <div>
            <H2>Location of origin:</H2>
            <H1>{countryFlag}</H1>
            <Label>{country || 'Unknown Location'}</Label>
            <Label>{city || ''}</Label>

            <H2>Device</H2>
            <div>{ipAddress}</div>
            <Label>{userAgent}</Label>
          </div>
          <br />
          <Button primary onClick={() => {}}>
            Authorize
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default compose(
  withUnauthorizedSession,
  withT
)(TokenAuthorization)
