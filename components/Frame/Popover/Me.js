import React from 'react'

import SignIn from '../../Auth/SignIn'
import SignOut from '../../Auth/SignOut'
import { Link } from '../../../lib/routes'

import { Label, linkRule } from '@project-r/styleguide'

export default ({ me, children }) =>
  <div>
    {children}
    {me &&
      <Link route='me'>
        <a {...linkRule}>Mein Konto</a>
      </Link>}
    <br />
    <br />
    {me &&
      <Label>
        {me.name || me.email}
      </Label>}
    <br />
    {me ? <SignOut /> : <SignIn />}
  </div>
