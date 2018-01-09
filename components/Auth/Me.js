import React from 'react'
import { compose } from 'react-apollo'

import withMe from '../../lib/apollo/withMe'
import withT from '../../lib/withT'

import SignIn from './SignIn'
import SignOut from './SignOut'

const Me = ({me, t, email}) => (
  <div>
    {me ? (
      <div>
        {t('me/signedinAs', {
          nameOrEmail: me.name ? `${me.name.trim()} (${me.email})` : me.email
        })}
        <br />
        <SignOut />
      </div>
    ) : (
      <SignIn email={email} />
    )}
  </div>
)

export default compose(
  withMe,
  withT
)(Me)
