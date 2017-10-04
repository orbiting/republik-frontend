import React from 'react'

import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { Link } from '../../../lib/routes'

import { Interaction, linkRule } from '@project-r/styleguide'

export default ({ me, children }) =>
  <div>
    {children}
    {me &&
      <Interaction.P>
        {me.name || me.email}
      </Interaction.P>}

    {me &&
      <Link route='me'>
        <a {...linkRule}>Mein Konto</a>
      </Link>}
    <br />
    <br />
    {me ? <SignOut /> : <SignIn />}
  </div>
