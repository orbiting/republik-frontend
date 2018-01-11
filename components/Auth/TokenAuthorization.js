import React from 'react'
import { compose } from 'react-apollo'
import {
  Button
} from '@project-r/styleguide'

import withUnauthorizedSession from '../../lib/apollo/withUnauthorizedSession'
import withT from '../../lib/withT'

const TokenAuthorization = ({ t, unauthorizedSession: { country, city, ipAddress, userAgent } = {}, email, token }) => (
  <div>
    {userAgent && (
      <div>
        {country}
        {city}
        {ipAddress}
        {userAgent}
        {email}

        <Button primary onClick={() => {}}>
          That's fine
        </Button>
      </div>
    )}
  </div>
)

export default compose(
  withUnauthorizedSession,
  withT
)(TokenAuthorization)
